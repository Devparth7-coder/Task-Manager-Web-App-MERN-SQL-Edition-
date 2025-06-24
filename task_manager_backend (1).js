// Backend with Bonus Features (Edit, Delete)
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize("task_db", "root", "password", {
  host: "localhost",
  dialect: "mysql"
});

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

const Task = sequelize.define("Task", {
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Task);
Task.belongsTo(User);

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.status(201).json({ message: "User created" });
  } catch {
    res.status(400).json({ error: "Signup failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ token });
});

const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(403);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch {
    res.sendStatus(403);
  }
};

app.get("/api/tasks", auth, async (req, res) => {
  const tasks = await Task.findAll({ where: { UserId: req.user.id } });
  res.json(tasks);
});

app.post("/api/tasks", auth, async (req, res) => {
  const { title, status } = req.body;
  const task = await Task.create({ title, status, UserId: req.user.id });
  res.status(201).json(task);
});

app.put("/api/tasks/:id", auth, async (req, res) => {
  const updates = req.body;
  const task = await Task.findOne({ where: { id: req.params.id, UserId: req.user.id } });
  if (!task) return res.status(404).json({ error: "Task not found" });
  await task.update(updates);
  res.json(task);
});

app.delete("/api/tasks/:id", auth, async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, UserId: req.user.id } });
  if (!task) return res.status(404).json({ error: "Task not found" });
  await task.destroy();
  res.json({ message: "Task deleted" });
});

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
