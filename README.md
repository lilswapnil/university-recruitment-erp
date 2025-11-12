# 🎓 University Recruitment ERP System

A comprehensive, full-stack Enterprise Resource Planning (ERP) system designed for modern university recruitment processes. Built with **Django REST Framework**, **PostgreSQL**, and **React TypeScript**, featuring a **Workday-inspired UI design** and complete containerization with **Docker**.

<div align="center">
  
![University ERP](https://img.shields.io/badge/University-ERP-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-5.1-092E20?style=for-the-badge&logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

</div>

## 🚀 Features

### 🎯 **Core Functionality**
- **Complete Recruitment Lifecycle Management**
- **Role-Based Access Control** (HR, Manager, Candidate)
- **Advanced Job Search & Filtering System**
- **Comprehensive Candidate Profile Management** 
- **Interactive Analytics & Dashboards**
- **Interview Management System**
- **Detailed Reporting & Export Tools**
- **Team Performance Analytics**
- **Mobile-Responsive Design**

### 🎨 **Modern UI/UX**
- **Workday-Inspired Design System**
- **Organized Component Architecture**
- **Reusable UI Component Library**
- **TailwindCSS Styling Framework**
- **Interactive Charts & Visualizations**
- **Modal-Based Workflows**
- **Responsive Grid Layouts**
- **Smooth Animations & Transitions**

### 🔐 **Security & Authentication**
- **JWT Token-Based Authentication**
- **Role-Based Access Control**
- **Secure API Endpoints**
- **Protected Route Navigation**
- **Session Management**

## 🏗️ Architecture

```
📦 university-recruitment-erp/
├── 🐍 backend/                    # Django REST API
│   ├── 📂 api/                    # Core API application
│   │   ├── 📄 models.py           # Database models
│   │   ├── 📄 serializers.py      # API serializers
│   │   ├── 📄 views.py            # API endpoints
│   │   └── 📂 management/         # Custom commands
│   ├── 📂 erp_core/               # Django project settings
│   └── 📂 migrations/             # Database migrations
├── ⚛️  frontend/                  # React TypeScript UI
│   ├── 📂 src/
│   │   ├── 📂 components/         # Organized component library
│   │   │   ├── 📂 pages/          # Full page components
│   │   │   │   ├── 📄 Analytics.tsx
│   │   │   │   ├── 📄 Interviews.tsx
│   │   │   │   ├── 📄 JobSearch.tsx
│   │   │   │   ├── 📄 Profile.tsx
│   │   │   │   └── 📄 Reports.tsx
│   │   │   ├── 📂 ui/             # Reusable UI components
│   │   │   │   ├── 📄 ChartCard.tsx
│   │   │   │   ├── 📄 Modal.tsx
│   │   │   │   └── 📄 DashboardCard.tsx
│   │   │   ├── 📂 common/         # Shared layout components
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   └── 📄 Sidebar.tsx
│   │   │   └── 📂 dashboards/     # Role-specific views
│   │   ├── 📂 contexts/           # React contexts
│   │   └── 📄 types.ts            # TypeScript interfaces
│   └── 📂 public/                 # Static assets
├── 📊 data/                       # Sample data & fixtures
├── 🐳 docker-compose.yml          # Container orchestration
└── 📋 README.md                   # You are here!
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

# View logs
docker compose logs -f

# Stop the application
docker compose down

# Restart the application
docker compose up -d

# Access backend shell
docker compose exec backend python manage.py shell
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
- ✅ **Analytics Dashboard** - Comprehensive recruitment metrics and trends
- ✅ **Interview Management** - Schedule, track, and manage interview processes  
- ✅ **Advanced Reporting** - Generate detailed reports with export capabilities
- ✅ **Settings Management** - Configure system preferences and notifications
- ✅ **Job Posting Management** - Create and manage job openings
- ✅ **Candidate Database** - Access all candidate profiles and applications
- ✅ **Document Management** - Download resumes and application documents

### 📋 **Manager Role**
- ✅ **Team Analytics** - Monitor team performance and productivity metrics
- ✅ **My Team Dashboard** - Manage team members and track activities
- ✅ **Department Analytics** - View department-specific recruitment data
- ✅ **Interview Participation** - Review and participate in interview processes
- ✅ **Application Review** - Evaluate candidate applications for team positions
- ✅ **Team Performance Reports** - Access team-specific analytics and insights

### 👤 **Candidate Role**
- ✅ **Job Search Portal** - Advanced search and filtering of job opportunities
- ✅ **Profile Management** - Comprehensive profile with experience, education, and skills
- ✅ **Application Tracking** - Monitor application status and progress
- ✅ **Document Upload** - Manage resume and supporting documents
- ✅ **Personal Dashboard** - View personalized job recommendations and updates
- ✅ **Communication Hub** - Receive notifications and updates about applications

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

# Create demo users (HR, Manager, Candidate)
docker compose exec backend python manage.py createdemousers

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
docker compose logs -f db
```

## 🎨 Component Architecture

The frontend follows a clean, organized architecture with separation of concerns:

### 📁 **Component Organization**
```
src/components/
├── pages/          # Full-page components (Analytics, Profile, etc.)
├── ui/             # Reusable UI components (Modals, Cards, etc.)  
├── common/         # Shared layout components (Header, Sidebar)
└── dashboards/     # Role-specific dashboard views
```

### 🧩 **Key Components**

| Component | Purpose | Features |
|-----------|---------|----------|
| **Analytics** | HR analytics dashboard | Charts, metrics, department stats |
| **JobSearch** | Candidate job discovery | Advanced filtering, search, apply |
| **Profile** | User profile management | Tabbed interface, file uploads |
| **Interviews** | Interview management | Scheduling, status tracking |
| **Reports** | Reporting system | Export capabilities, visualizations |

## 📈 Recent Improvements

### ✅ **Code Quality**
- **Organized File Structure** - Clean separation of pages, UI, and common components
- **TypeScript Compliance** - Resolved all compilation errors and type issues
- **Import Path Optimization** - Consistent and maintainable import structure
- **Unused Code Cleanup** - Removed redundant imports and dead code

### ✅ **Enhanced Features**  
- **Complete Navigation** - All sidebar menu items now have functional pages
- **Role-Based Access** - Proper permissions and page access control
- **Interactive Components** - Modal dialogs, charts, and dynamic content
- **Mock Data Integration** - Realistic sample data for demonstration

### ✅ **Developer Experience**
- **Index File Exports** - Simplified component imports with barrel exports
- **Consistent Styling** - Workday-inspired design system throughout
- **Error-Free Compilation** - Clean builds with only minor eslint warnings

## 📊 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/auth/login/` | User authentication | Public |
| `POST` | `/api/auth/register/` | User registration | Public |
| `GET` | `/api/auth/current_user/` | Current user info | Authenticated |
| `GET` | `/api/jobs/` | List job openings | All roles |
| `POST` | `/api/jobs/` | Create job posting | HR only |
| `GET` | `/api/candidates/` | List candidates | HR, Manager |
| `POST` | `/api/applications/` | Submit application | Candidate |
| `GET` | `/api/applications/` | List applications | HR, Manager |
| `GET` | `/api/profile/` | User profile data | Authenticated |

## 🔧 Troubleshooting

### Common Issues

**Container Startup Issues:**
```bash
# Clean up and rebuild
docker compose down -v
docker system prune -f
docker compose up --build
```

**Port Conflicts:**
```bash
# Check if ports 3000, 8000, 5432 are available
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

**Database Connection Issues:**
```bash
# Reset database
docker compose down -v
docker volume rm $(docker volume ls -q | grep postgres)
docker compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the established patterns
4. Ensure all components are properly organized in their directories
5. Test compilation and functionality
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Follow the established file organization structure
- Use TypeScript for all new components
- Maintain Workday-inspired design consistency
- Include proper error handling and loading states

## 🎉 Project Status

### ✅ **Current Version: 2.0**
- **✅ Full Navigation System** - All menu items functional across all roles
- **✅ Clean Architecture** - Organized, maintainable codebase
- **✅ Error-Free Compilation** - Stable, production-ready build
- **✅ Complete Role Management** - HR, Manager, and Candidate workflows
- **✅ Responsive Design** - Mobile-friendly interface
- **✅ Interactive Analytics** - Charts, reports, and data visualization

### 🚀 **Ready for Production**
- Containerized deployment with Docker
- Secure authentication system
- Scalable architecture
- Comprehensive error handling

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Workday** for design inspiration and UI/UX patterns
- **Django REST Framework** community for robust API development
- **React TypeScript** ecosystem for modern frontend architecture  
- **TailwindCSS** for utility-first CSS framework
- **Lucide React** for beautiful, consistent icons
- **Docker** for seamless containerization

## 📞 Support

For questions, suggestions, or support:
- 📧 Create an issue in this repository
- 🔧 Check the troubleshooting section above
- 📖 Review the component documentation in `/src/components/`

---

<div align="center">
  <p><strong>🎓 Built with ❤️ for Modern University Recruitment</strong></p>
  <p>⭐ Star this repository if you find it helpful!</p>
  <p><em>Empowering universities with efficient recruitment management</em></p>
</div>