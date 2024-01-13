const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let courses = [];
let users = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/courses', (req, res) => {
  res.json(courses);
});

app.post('/courses', (req, res) => {
  const { title, instructor, description } = req.body;
  const course = { id: courses.length, title, instructor, description };
  courses.push(course);
  res.json(course);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  const user = { id: users.length, username, email, password };
  users.push(user);
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});