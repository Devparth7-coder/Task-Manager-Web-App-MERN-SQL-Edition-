// Frontend: Task Manager Web App
// Folder: /client

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Sample CSS Framework
import "tailwindcss/tailwind.css";

// Auth Context (for session)
const AuthContext = React.createContext();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">Login</button>
      </form>
    </div>
  );
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/signup", { name, email, password });
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-green-500 text-white px-4 py-2" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const { token, logout } = React.useContext(AuthContext);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title.trim()) return;
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, status: "To Do" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    const nextStatus = status === "To Do" ? "In Progress" : status === "In Progress" ? "Done" : "Done";
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { status: nextStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Task Dashboard</h1>
        <button className="bg-red-500 text-white px-3 py-1" onClick={logout}>Logout</button>
      </div>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 border p-2" placeholder="Task title..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="bg-blue-500 text-white px-4" onClick={createTask}>Add Task</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <div key={status}>
            <h2 className="text-xl font-semibold mb-2">{status}</h2>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className="bg-gray-100 p-2 mb-2 rounded shadow">
                  <p>{task.title}</p>
                  {status !== 'Done' && (
                    <button
                      className="text-blue-500 text-sm mt-1"
                      onClick={() => updateStatus(task.id, task.status)}
                    >
                      Mark as {status === 'To Do' ? 'In Progress' : 'Done'}
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
