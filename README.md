# ✅ Task Manager Web App (MERN + SQL Edition)

A full-stack web app that allows users to manage their tasks with login, categorization by status (To Do, In Progress, Done), and full CRUD operations.

---

## 🚀 Features

- 🔐 User Signup/Login (JWT Auth)
- 📋 Task Creation, Editing, Deletion
- 🔄 Status Updates (To Do → In Progress → Done)
- 🔍 Task Search
- 📱 Responsive UI (Tailwind CSS)

---

## 🛠️ Tech Stack

| Layer      | Tech                           |
|------------|--------------------------------|
| Frontend   | React.js + Tailwind CSS        |
| Backend    | Node.js + Express.js           |
| Database   | MySQL with Sequelize ORM       |
| Auth       | JWT, bcrypt                    |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🧑‍💻 API Endpoints

### Auth
| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | /api/signup     | Register new user    |
| POST   | /api/login      | Login user           |

### Tasks
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/tasks         | Get all tasks (Auth)     |
| POST   | /api/tasks         | Add task (Auth)          |
| PUT    | /api/tasks/:id     | Update title/status      |
| DELETE | /api/tasks/:id     | Delete task              |

---

## 🖥️ Setup Instructions

### Backend
```bash
cd server
npm install
# Create .env file:
echo "JWT_SECRET=yourSecretKey" > .env
# Configure MySQL DB in Sequelize config
node index.js
```
### Frontend
```bash
cd client
npm install
npm start
```

🌍 Deployment
🔧 Backend: Render
Push backend code to GitHub

Create new Render Web Service

Add JWT_SECRET in environment variables

Use start script: node index.js

Connect MySQL DB (use free ClearDB or PlanetScale if needed)

💅 Frontend: Vercel
Push frontend code to GitHub

Import project into Vercel

Set environment variable REACT_APP_API_URL (point to Render URL)

Deploy!
📚 License
MIT License
© 2025 Dev Parth

markdown
Copy
Edit

---

## 🚀 Step 2: Deployment Guide

### 🌐 Backend on Render

1. Go to [https://render.com](https://render.com)
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables**:
     ```
     JWT_SECRET=yourSecret
     DB_HOST=...
     DB_USER=...
     DB_PASS=...
     DB_NAME=task_db
     ```
5. Deploy!

> ✅ Use ClearDB (Heroku Add-on) or PlanetScale for free MySQL DB if needed

---

### 🌐 Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **New Project**
3. Connect to your frontend GitHub repo
4. Set environment variable:
