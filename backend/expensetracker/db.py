import os

import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from django.contrib.auth.hashers import make_password

load_dotenv()


class ExpenseTrackerDb:

    def __init__(self):
        self.conn_info = {
            "dbname": os.getenv("DB_NAME"),
            "user": os.getenv("DB_USER"),
            "password": os.getenv("DB_PASSWORD"),
            "host": os.getenv("DB_HOST"),
            "port": int(os.getenv("DB_PORT")),
            "sslmode": os.getenv("DB_SSLMODE"),
        }

    def register_user(self, email, first_name, last_name, username, password):

        try:

            hashed_password = make_password(password)

            with psycopg.connect(**self.conn_info) as conn:
                with conn.cursor() as cur:

                    cur.execute(
                        """
                        INSERT INTO users
                        (
                            email,
                            first_name,
                            last_name,
                            username,
                            password
                        )
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (
                            email,
                            first_name,
                            last_name,
                            username,
                            hashed_password,
                        ),
                    )

            return {"success": True, "message": "User registered successfully."}

        except psycopg.errors.UniqueViolation:

            return {"success": False, "message": "Username or email already exists."}

    def get_user_by_login(self, login):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor(row_factory=dict_row) as cur:

                cur.execute(
                    """
                    SELECT
                        user_id,
                        email,
                        first_name,
                        last_name,
                        username,
                        password,
                        created_at
                    FROM users
                    WHERE username = %s
                       OR email = %s
                    """,
                    (login, login),
                )

                return cur.fetchone()

    def get_user_by_id(self, user_id):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor(row_factory=dict_row) as cur:

                cur.execute(
                    """
                    SELECT
                        user_id,
                        email,
                        first_name,
                        last_name,
                        username,
                        created_at
                    FROM users
                    WHERE user_id = %s
                    """,
                    (user_id,),
                )

                return cur.fetchone()

    def create_category(self, user_id, category_name, category_type):

        try:
            with psycopg.connect(**self.conn_info) as conn:
                with conn.cursor() as cur:

                    cur.execute(
                        """
                        INSERT INTO categories
                        (
                            user_id,
                            category_name,
                            type
                        )
                        VALUES (%s, %s, %s)
                        """,
                        (
                            user_id,
                            category_name,
                            category_type,
                        ),
                    )

            return {
                "success": True,
                "message": "Category created successfully."
            }

        except psycopg.errors.UniqueViolation:
            return {
                "success": False,
                "message": "Category already exists."
            }

            
    def get_categories(self, user_id):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor(row_factory=dict_row) as cur:

                cur.execute(
                    """
                    SELECT
                        category_id,
                        category_name,
                        type
                    FROM categories
                    WHERE user_id = %s
                    ORDER BY
                        CASE
                            WHEN type = 'Income' THEN 1
                            ELSE 2
                        END,
                        category_name
                    """,
                    (user_id,),
                )

                return cur.fetchall()
            
    def create_transaction(self,user_id,category_id,amount,description,transaction_date,):

        try:

            with psycopg.connect(**self.conn_info) as conn:
                with conn.cursor(row_factory=dict_row) as cur:

                    # Verify that the category belongs to the logged-in user
                    cur.execute(
                        """
                        SELECT category_id
                        FROM categories
                        WHERE category_id = %s
                        AND user_id = %s
                        """,
                        (
                            category_id,
                            user_id,
                        ),
                    )

                    if cur.fetchone() is None:
                        return {
                            "success": False,
                            "message": "Invalid category."
                        }

                    cur.execute(
                        """
                        INSERT INTO transactions
                        (
                            user_id,
                            category_id,
                            amount,
                            description,
                            transaction_date
                        )
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (
                            user_id,
                            category_id,
                            amount,
                            description,
                            transaction_date,
                        ),
                    )

            return {
                "success": True,
                "message": "Transaction added successfully."
            }

        except psycopg.Error:
            return {
                "success": False,
                "message": "Failed to add transaction."
            }
            
    def get_transactions(self, user_id, year=None, month=None):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor(row_factory=dict_row) as cur:

                query = """
                    SELECT
                        t.transaction_id,
                        t.amount,
                        t.description,
                        t.transaction_date,
                        t.created_at,
                        c.category_id,
                        c.category_name,
                        c.type
                    FROM transactions t
                    INNER JOIN categories c
                        ON t.category_id = c.category_id
                    WHERE t.user_id = %s
                """

                params = [user_id]

                if year and month:
                    query += """
                        AND EXTRACT(YEAR FROM t.transaction_date) = %s
                        AND EXTRACT(MONTH FROM t.transaction_date) = %s
                    """
                    params.extend([int(year), int(month)])

                query += """
                    ORDER BY
                        t.transaction_date DESC,
                        t.created_at DESC
                """

                cur.execute(query, params)

                return cur.fetchall()
    
    def update_category(self, user_id, category_id, category_name, category_type):

        try:
            with psycopg.connect(**self.conn_info) as conn:
                with conn.cursor() as cur:

                    cur.execute(
                        """
                        UPDATE categories
                        SET
                            category_name = %s,
                            type = %s
                        WHERE
                            category_id = %s
                            AND user_id = %s
                        """,
                        (
                            category_name,
                            category_type,
                            category_id,
                            user_id,
                        ),
                    )

                    if cur.rowcount == 0:
                        return {
                            "success": False,
                            "message": "Category not found."
                        }

            return {
                "success": True,
                "message": "Category updated successfully."
            }

        except psycopg.errors.UniqueViolation:
            return {
                "success": False,
                "message": "Category already exists."
            }
            
    
    def delete_category(self, user_id, category_id):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor() as cur:

                cur.execute(
                    """
                    DELETE FROM categories
                    WHERE
                        category_id = %s
                        AND user_id = %s
                    """,
                    (
                        category_id,
                        user_id,
                    ),
                )

                if cur.rowcount == 0:
                    return {
                        "success": False,
                        "message": "Category not found."
                    }

        return {
            "success": True,
            "message": "Category deleted successfully."
        }
        
        
    def update_transaction(self,user_id,transaction_id,category_id,amount,description,transaction_date,):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor() as cur:

                cur.execute(
                    """
                    UPDATE transactions
                    SET
                        category_id = %s,
                        amount = %s,
                        description = %s,
                        transaction_date = %s
                    WHERE
                        transaction_id = %s
                        AND user_id = %s
                    """,
                    (
                        category_id,
                        amount,
                        description,
                        transaction_date,
                        transaction_id,
                        user_id,
                    ),
                )

                if cur.rowcount == 0:
                    return {
                        "success": False,
                        "message": "Transaction not found."
                    }

        return {
            "success": True,
            "message": "Transaction updated successfully."
        }
        
    def delete_transaction(self, user_id, transaction_id):

        with psycopg.connect(**self.conn_info) as conn:
            with conn.cursor() as cur:

                cur.execute(
                    """
                    DELETE FROM transactions
                    WHERE
                        transaction_id = %s
                        AND user_id = %s
                    """,
                    (
                        transaction_id,
                        user_id,
                    ),
                )

                if cur.rowcount == 0:
                    return {
                        "success": False,
                        "message": "Transaction not found."
                    }

        return {
            "success": True,
            "message": "Transaction deleted successfully."
        }