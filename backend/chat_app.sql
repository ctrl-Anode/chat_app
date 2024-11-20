-- Create Database
CREATE DATABASE chat_app;

-- Use the database
USE chat_app;

-- Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Messages Table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Example Users (Optional, for testing)
INSERT INTO users (username, password) VALUES 
('alice', 'password1'), -- Replace 'password1' with hashed values in real scenarios
('bob', 'password2');

-- Example Messages (Optional, for testing)
INSERT INTO messages (sender_id, receiver_id, content) VALUES
(1, 2, 'Hello Bob!'),
(2, 1, 'Hi Alice!');
