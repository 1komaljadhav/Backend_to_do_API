const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'osumare-task-secret';

app.use(express.json());
app.use(morgan('dev'));

// ✅ In-memory task storage
let tasks = [
  { id: '1', title: 'Test', description: 'Sample task' }
];

// ✅ JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ✅ Dummy login to get JWT token
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const user = { username };
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// ✅ Validation middleware
function validateTask(req, res, next) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }
  next();
}

// 🔒 Protect all task routes
app.use('/tasks', authenticateToken);

// 📥 Create a task
app.post('/tasks', validateTask, (req, res) => {
  const { title, description } = req.body;
  const newTask = { id: uuidv4(), title, description };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 📤 Get all tasks with optional pagination, sorting, filtering
app.get('/tasks', (req, res) => {
  let result = [...tasks];
  let { page = 1, limit = 5, sortBy = 'title', order = 'asc', search = '' } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  // 🔍 Filtering
  if (search) {
    result = result.filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) || 
      task.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 🔃 Sorting
  result.sort((a, b) => {
    const fieldA = a[sortBy].toLowerCase();
    const fieldB = b[sortBy].toLowerCase();
    if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // 📄 Pagination
  const start = (page - 1) * limit;
  const paginatedTasks = result.slice(start, start + limit);

  res.json({
    page,
    totalTasks: result.length,
    totalPages: Math.ceil(result.length / limit),
    tasks: paginatedTasks
  });
});

// 📥 Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found.' });
  res.json(task);
});

// ✏️ Update a task
app.put('/tasks/:id', validateTask, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found.' });

  const updatedTask = { ...tasks[taskIndex], ...req.body };
  tasks[taskIndex] = updatedTask;

  res.json(updatedTask);
});

// ✅ Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found.' });

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted successfully.' });
});

// 🛠 Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});
