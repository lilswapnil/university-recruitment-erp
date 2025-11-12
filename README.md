# 🎓 University Recruitment ERP System

A modern, full-stack Enterprise Resource Planning (ERP) system designed for university recruitment processes. Built with **Django REST Framework**, **PostgreSQL**, and **React TypeScript**, featuring a **Workday-inspired UI design** and complete containerization with **Docker**.

<div align="center">
  
![University ERP](https://img.shields.io/badge/University-ERP-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-5.1.3-092E20?style=for-the-badge&logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

</div>

## 🚀 Features

### 🎯 **Core Functionality**
- **Complete Recruitment Lifecycle Management**
- **Role-Based Access Control** (HR, Manager, Candidate)
- **Job Posting & Application Management** 
- **Candidate Profile & Resume Management**
- **Real-time Analytics & Dashboards**
- **Mobile-Responsive Design**

### 🎨 **Modern UI/UX**
- **Workday-Inspired Design System**
- **CSS Grid Layout with Mobile Responsiveness**
- **Gradient Backgrounds & Smooth Animations**
- **TailwindCSS Styling Framework**
- **Interactive Sidebar Navigation**
- **Dark Theme Support**

### 🔐 **Security & Authentication**
- **JWT Token-Based Authentication**
- **Role-Based Permissions**
- **Secure API Endpoints**
- **Protected Route Navigation**

## 🏗️ Architecture

```
📦 university-erp/
├── 🐍 backend/               # Django REST API
│   ├── 📂 api/               # Core API application
│   ├── 📂 erp_core/          # Django project settings
│   ├── 📂 media/             # File uploads
│   └── 📂 migrations/        # Database migrations
├── ⚛️  frontend/             # React TypeScript UI
│   ├── 📂 src/
│   │   ├── 📂 components/    # React components
│   │   ├── 📂 contexts/      # React contexts
│   │   └── 📂 dashboards/    # Role-specific views
│   └── 📂 public/            # Static assets
├── 📊 data/                  # Sample data & fixtures
├── 🐳 docker-compose.yml     # Container orchestration
└── 📋 README.md              # You are here!
```

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with **TypeScript**
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **React Context** for state management

### **Backend**
- **Django 5.1** with **Django REST Framework**
- **PostgreSQL** database
- **JWT Authentication**
- **CORS enabled** for frontend integration

### **DevOps & Tools**
- **Docker & Docker Compose** for containerization
- **Nginx** for production deployment
- **Git** for version control

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Git](https://git-scm.com/) for cloning the repository

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/lilswapnil/university-erp.git
cd university-erp/recruitment-erp-project
```

### 2️⃣ Start the Application
```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

### 3️⃣ Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Frontend** | [http://localhost:3000](http://localhost:3000) | React application |
| 🔧 **Backend API** | [http://localhost:8000/api/](http://localhost:8000/api/) | Django REST API |
| 👨‍💼 **Admin Panel** | [http://localhost:8000/admin/](http://localhost:8000/admin/) | Django admin interface |

## 👥 Default User Accounts

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| 🛡️ **Administrator** | `admin` | `admin123` | Full system access |
| 👔 **HR Manager** | `hr` | `hr123` | HR operations & analytics |
| 📋 **Manager** | `manager` | `manager123` | Team management |
| 👤 **Candidate** | `candidate` | `candidate123` | Application management |

## 🎯 User Roles & Permissions

### 👔 **HR Role**
- ✅ Create and manage job postings
- ✅ View all candidates and applications
- ✅ Access recruitment analytics
- ✅ Manage candidate profiles
- ✅ Download resumes and documents

### 📋 **Manager Role**
- ✅ View job postings for their department
- ✅ Review candidate applications
- ✅ Access team analytics
- ✅ Manage interview processes

### 👤 **Candidate Role**
- ✅ View available job openings
- ✅ Submit job applications
- ✅ Upload resume and documents
- ✅ Track application status
- ✅ Update profile information

## 🔧 Development

### Running in Development Mode

#### Frontend Development
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3001
```

#### Backend Development
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver  # Runs on http://localhost:8000
```

### Database Management
```bash
# Run migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# Populate with sample data
docker compose exec backend python manage.py populatedb
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login/` | User authentication |
| `GET` | `/api/jobs/` | List job openings |
| `POST` | `/api/jobs/` | Create job posting |
| `GET` | `/api/candidates/` | List candidates |
| `POST` | `/api/applications/` | Submit application |
| `GET` | `/api/profile/` | User profile data |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Workday** for design inspiration
- **Django** and **React** communities
- **TailwindCSS** for the utility-first CSS framework

---

<div align="center">
  <p><strong>Built with ❤️ for modern recruitment management</strong></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>