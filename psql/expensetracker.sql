-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- CATEGORIES
-- =========================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL
        CHECK (type IN ('Income','Expense')),

    CONSTRAINT fk_category_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_category
        UNIQUE(user_id, category_name, type)
);

-- =========================================
-- TRANSACTIONS
-- =========================================
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    category_id INT NOT NULL,

    amount NUMERIC(10,2) NOT NULL
        CHECK(amount > 0),

    description TEXT,

    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaction_category
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);