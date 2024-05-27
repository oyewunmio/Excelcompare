import secrets
from typing import Annotated, Any, Literal

from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )
    PROJECT_NAME: str = "Security FastAPi"
    FRONTEND_URL: AnyUrl = "http://localhost:9000/api/v1/"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    DOMAIN: str = "localhost"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        []
    )

    ALGORITHM: str = "HS256"
    JWT_EXPIRE: int = 10
    EMAIL_VERIFY_EMAIL_EXPIRE_MINUTES: int = 60 * 24 * 8
    EMAILS_FROM_NAME: str = "Security FastAPI"
    EMAILS_FROM_EMAIL: str = ""

    # testing
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 2525
    SMTP_HOST: str = "sandbox.smtp.mailtrap.io"
    SMTP_USER: str = "6f67eefc2d4b2a"
    SMTP_PASSWORD: str = "ff7aed1c675a39"

    # production
    # SMTP_TLS: bool = True
    # SMTP_SSL: bool = False
    # SMTP_PORT: int = 587
    # SMTP_HOST: str = "live.smtp.mailtrap.io"
    # SMTP_USER: str = "api"
    # SMTP_PASSWORD: str = "98fbe99c1727ab2e8a6602554da91252"


settings = Settings()  # type: ignore
