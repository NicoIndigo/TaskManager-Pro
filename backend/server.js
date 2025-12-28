const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware (Logs)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuración de Base de Datos
const db = new sqlite3.Database('tasks.db', (err) => { // Base de datos persistente en archivo
    if (err) {
        console.error('Error abriendo base de datos', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending', 
      priority TEXT DEFAULT 'medium',
      createdAt TEXT,
      dueDate TEXT
    )`, (err) => {
            if (err) {
                console.error('Error creando tabla', err.message);
            }
        });
    }
});

// Ayudante para obtener fecha actual
const getCurrentDate = () => new Date().toISOString();

// Rutas

// Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
    const { status, priority, search } = req.query;
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    if (priority) {
        sql += ' AND priority = ?';
        params.push(priority);
    }
    if (search) {
        sql += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Obtener una tarea
app.get('/api/tasks/:id', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Crear tarea
app.post('/api/tasks', (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
        res.status(400).json({ error: 'El título es obligatorio' });
        return;
    }
    const createdAt = getCurrentDate();
    const sql = 'INSERT INTO tasks (title, description, status, priority, createdAt, dueDate) VALUES (?,?,?,?,?,?)';
    const params = [title, description || '', status || 'pending', priority || 'medium', createdAt, dueDate || null];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: {
                id: this.lastID,
                title, description, status, priority, createdAt, dueDate
            }
        });
    });
});

// Actualizar tarea
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    const sql = `UPDATE tasks SET 
    title = COALESCE(?, title), 
    description = COALESCE(?, description), 
    status = COALESCE(?, status), 
    priority = COALESCE(?, priority), 
    dueDate = COALESCE(?, dueDate) 
    WHERE id = ?`;
    const params = [title, description, status, priority, dueDate, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// Eliminar tarea
app.delete('/api/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const params = [req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'deleted',
            changes: this.changes
        });
    });
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
