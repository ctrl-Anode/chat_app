const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

app.use(express.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// API Endpoints
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) res.send(result[0]);
        else res.status(401).send('Invalid credentials');
    });
});

app.get('/users', (req, res) => {
    db.query('SELECT id, username FROM users', (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.post('/messages', (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    db.query('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', [sender_id, receiver_id, content], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Message sent', id: result.insertId });
    });
});

app.get('/messages/:userId/:receiverId', (req, res) => {
    const { userId, receiverId } = req.params;
    db.query(
        'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at',
        [userId, receiverId, receiverId, userId],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
});

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
