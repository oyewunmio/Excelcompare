"""added differences to log

Revision ID: a24dbc0ed400
Revises: 39aa156b9acf
Create Date: 2024-05-27 12:53:31.878356

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a24dbc0ed400'
down_revision: Union[str, None] = '39aa156b9acf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('log', sa.Column('document_differences', sqlmodel.sql.sqltypes.AutoString(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('log', 'document_differences')
    # ### end Alembic commands ###