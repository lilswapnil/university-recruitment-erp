# 🎓 University Recruitment ERP System

This is a full-stack University Recruitment ERP built with **Django (REST Framework)**, **PostgreSQL**, and **React (TypeScript)**, fully containerized with **Docker**.

This application manages the complete recruitment lifecycle, from posting job openings to managing candidates, scheduling interviews, and tracking applications.

* **Backend:** `/backend` (Django, DRF, PostgreSQL)
* **Frontend:** `/frontend` (React, TypeScript)

## Tech Stack (matches Classavo requirements)

* **Frontend:** React, TypeScript, TailwindCSS
* **Backend:** Django, Django REST Framework, Python
* **Database:** PostgreSQL
* **DevOps:** Docker, Docker Compose
* **API Testing:** Postman

## How to Run

1.  Make sure you have Docker Desktop installed and running.
2.  From the project root, run:

    ```bash
    docker compose up --build
    ```

3.  Wait for the containers to build and start.
4.  Access the application:
    * **React Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Django API:** [http://localhost:8000/api/](http://localhost:8000/api/)
    * **Django Admin:** [http://localhost:8000/admin/](http://localhost:8000/admin/) (user: `admin`, pass: `admin123`)
