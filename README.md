# 🗂️ Centralized Project Workspace

A full-stack **Team-Based Project & Document Management System** built as part of an internship project. It enables organizations, colleges, startups, and small teams to manage projects, tasks, teams, and documents in a single centralized platform.

---

## 🚀 Tech Stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | React.js (Vite), React Router, Axios, Tailwind CSS, Redux Toolkit |
| Backend  | Python, Django, Django REST Framework                             |
| Database | MySQL                                                             |
| Auth     | JWT — djangorestframework-simplejwt                               |
| Tools    | VS Code, Postman, Git & GitHub                                    |

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, JWT-based auth, Password encryption
- 👥 **Team Management** — Create teams, add members, assign roles
- 📁 **Project Management** — Create projects, assign teams, set deadlines, track status
- ✅ **Task Management** — Create tasks, assign to members, update status
- 📄 **Document Management** — Upload, download, delete documents per project
- 📊 **Dashboard** — Project stats, charts, progress overview

---

## 👤 User Roles

| Role        | Permissions                                               |
| ----------- | --------------------------------------------------------- |
| Admin       | Manage users, manage teams, monitor all projects          |
| Team Lead   | Create projects, assign tasks, upload documents           |
| Team Member | View assigned tasks, update task status, upload documents |

---

## 📁 Project Structure

```
centralized-workspace/
│
├── backend/                        # Django REST API
│   ├── core/                       # Project config (settings, urls)
│   ├── users/                      # Auth & user management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── permissions.py
│   ├── teams/                      # Team management
│   ├── projects/                   # Project management
│   ├── tasks/                      # Task management
│   ├── documents/                  # Document upload/download
│   ├── media/                      # Uploaded files
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                       # React + Vite
    └── src/
        ├── components/             # Reusable UI components
        ├── pages/                  # Full pages (Login, Dashboard, etc.)
        ├── services/               # Axios API calls
        ├── routes/                 # Protected & public routes
        ├── hooks/                  # Custom React hooks
        ├── layouts/                # Page layouts (sidebar, header)
        ├── utils/                  # Helper functions
        ├── redux/                  # State management
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 14+
- Git

---

### 🔧 Backend Setup

```bash
# 1. Go to backend folder
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file (see .env.example)

# 5. Run migrations
python manage.py migrate

# 6. Start server
python manage.py runserver
```

---

### 💻 Frontend Setup

```bash
# 1. Go to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
SECRET_KEY= 5v589eZEDSHLHEJoA0A3kNxU0n3KYW8FRt7xuTjFSj8aLMSkgXdFyQy6hD7_q39Aa4s
DEBUG=True
DB_NAME=workspace_db
DB_USER=root
DB_PASSWORD=subham17
DB_HOST=localhost
DB_PORT=3306
```

> ⚠️ Never commit your `.env` file to GitHub!

---

## 📦 Backend Dependencies

```
django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
mysqlclient
python-dotenv
```

---

## 🗓️ Development Timeline

| Week   | Focus              | Deliverables                              |
| ------ | ------------------ | ----------------------------------------- |
| Week 1 | Setup & Auth       | DB design, Django + React setup, JWT Auth |
| Week 2 | Teams & Projects   | Team CRUD, Project CRUD, APIs             |
| Week 3 | Tasks & Documents  | Task CRUD, Document upload/download       |
| Week 4 | Dashboard & Polish | Charts, pagination, form validation       |
| Week 5 | QA & Testing       | Unit tests, API testing, bug fixing       |

---

## 🧪 Testing

| Type         | Tool                   | Scope                                         |
| ------------ | ---------------------- | --------------------------------------------- |
| Unit Testing | Django TestCase / Jest | Individual model methods and React components |
| API Testing  | Postman                | All REST endpoints                            |
| UI Testing   | Browser DevTools       | Responsive layout, form validation            |
| Integration  | Manual / Postman       | End-to-end flows                              |

---

## 🔒 Security

- JWT access token (15 min) + refresh token (7 days)
- Password hashing via Django's PBKDF2
- Role-based access control on all API views
- Protected routes on frontend
- CORS restricted to frontend origin only
- Secret keys stored in `.env` — never committed to Git

---

## 📌 Status

🚧 **In Development** — Internship Project (5 Weeks)

---

## 🙋‍♂️ Author

**Subham Sahoo**
Internship Project — Full Stack Developer
