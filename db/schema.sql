-- Users table for authentication and roles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Requester', 'Approver', 'Reviewer', 'Administrator')) NOT NULL
);

-- Requests table for storing request details
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    request_type VARCHAR(50) CHECK (request_type IN ('Leave', 'Expense', 'Purchase Order', 'Other')) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Approved', 'Rejected', 'In Progress')) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approvals table to track approvals
CREATE TABLE approvals (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES requests(id),
    approver_id INT NOT NULL REFERENCES users(id),
    approval_status VARCHAR(50) CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')) NOT NULL,
    comment TEXT,
    approval_date TIMESTAMP
);

-- Workflow rules to define approval steps for each request type
CREATE TABLE workflow_rules (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) CHECK (request_type IN ('Leave', 'Expense', 'Purchase Order')) NOT NULL,
    approver_role VARCHAR(50) CHECK (approver_role IN ('Manager', 'Director', 'HR', 'Finance')) NOT NULL,
    approver_sequence INT NOT NULL,
    approver_condition VARCHAR(255)
);
