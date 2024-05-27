from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session
from models import User, Log
from database import create_db_and_tables
from schemas import UserLogin, Token
from crud import get_user_by_username, create_log, read_log
from utils import create_token, authenticate
from typing import Annotated, List
from deps import get_db, get_current_user, get_admin_user

import pandas as pd
import socket
from fpdf import FPDF
from datetime import datetime
from fastapi.responses import StreamingResponse
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://32c9-129-205-124-194.ngrok-free.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization"],
)

create_db_and_tables()

@app.post("/auth/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[Session, Depends(get_db)],
):
    # get user by username
    user = authenticate(
        session=db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    return Token(access_token=create_token(subject=user.username))

@app.post("/compare")
async def compare_files(db: Annotated[Session, Depends(get_db)], file1: UploadFile = File(...), file2: UploadFile = File(...), user: User = Depends(get_current_user)):
    df1 = pd.read_csv(file1.file) if file1.filename.endswith('.csv') else pd.read_excel(file1.file)
    df2 = pd.read_csv(file2.file) if file2.filename.endswith('.csv') else pd.read_excel(file2.file)

    # Check if columns match
    if not df1.columns.equals(df2.columns):
        return {"differences": "Columns in the two sheets do not match. Comparison aborted."}

    differences = []

    # Check for additional columns in compare sheet
    additional_columns = set(df2.columns) - set(df1.columns)
    if additional_columns:
        differences.append("Additional columns found in compare sheet:")
        for col in additional_columns:
            differences.append(f"- {col}")

    row_differences_header = False

    for row in range(max(len(df1), len(df2))):
        if row >= len(df1) or row >= len(df2):
            if not row_differences_header:
                differences.append("Row Differences:")
                row_differences_header = True
            if row < len(df1):
                original_row = df1.iloc[row]
                differences.append(
                    f"Row {row+1} in original sheet is missing in compare sheet. "
                    f"Row Details: {original_row.to_dict()}"
                )
            if row < len(df2):
                compare_row = df2.iloc[row]
                differences.append(
                    f"Row {row+1} in compare sheet is missing in original sheet. "
                    f"Row Details: {compare_row.to_dict()}"
                )
            continue

        original_row = df1.iloc[row]
        compare_row = df2.iloc[row]

        if compare_row.isnull().all():
            continue

        row_differences = []

        for col in range(len(original_row)):
            original_value = original_row.iloc[col]
            compare_value = compare_row.iloc[col]

            if isinstance(original_value, str):
                original_value = original_value.strip()
            if isinstance(compare_value, str):
                compare_value = compare_value.strip()

            if isinstance(original_value, pd.Timestamp):
                original_value = original_value.to_pydatetime()
            if isinstance(compare_value, pd.Timestamp):
                compare_value = compare_value.to_pydatetime()

            if original_value != compare_value:
                difference = f"Row: {row+1}, Column: {df1.columns[col]} - Original: {original_value}, Compare: {compare_value}"
                row_differences.append(difference)

        if row_differences:
            if not row_differences_header:
                differences.append("Row Differences:")
                row_differences_header = True
            for diff in row_differences:
                differences.append(diff)

    if not differences:
        differences = ["No differences found"]
    
    computer_name = socket.gethostname()

    create_log(db, user.username, differences)
    
    return {
        "differences": differences,
        "username": user.username,
        "computer_name": computer_name,
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }


@app.get("/get/me")
def protected_route(user: User = Depends(get_current_user)):
    return JSONResponse(status_code=201, content={"username": user.username, "role": user.user_role})


@app.get("/logs", response_model=List[Log])
async def get_logs(db: Annotated[Session, Depends(get_db)], user: User = Depends(get_admin_user)):
    logs = read_log(db)
    return logs