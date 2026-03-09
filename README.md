Employee Task Management System (ETMS)

A full-stack Employee Task Management System built using ASP.NET Core Web API (Clean Architecture) and Angular.
The system allows managers to assign tasks, track employee attendance, monitor performance, and manage employee workflows efficiently.

Tech Stack
Backend

ASP.NET Core Web API

Clean Architecture

Entity Framework Core

SQL Server

JWT Authentication

Frontend

Angular

TypeScript

Bootstrap / CSS

Tools

Visual Studio

VS Code

Git & GitHub

Project Structure
ETMS
│
├── ETMS.API             → Web API (Controllers)
├── ETMS.Application     → Business Logic
├── ETMS.Domain          → Entities
├── ETMS.Infrastructure  → Database & Repositories
│
├── frontend
│   └── etms-ui          → Angular Application
│
└── README.md
Features
Manager

Assign tasks to employees

Review employee performance

Monitor attendance

Manage leave requests

Employee

View assigned tasks

Update task progress

Submit leave requests

Mark attendance

How to Run the Project
Backend (.NET API)

Open the solution in Visual Studio

Update connection string in:

appsettings.json

Run migrations if required:

Update-Database

Run the API

https://localhost:xxxx
Frontend (Angular)

Navigate to the frontend folder:

cd frontend/etms-ui

Install dependencies:

npm install

Run the Angular application:

ng serve

Open in browser:

http://localhost:4200
Future Enhancements

Role-based access control

Notifications

Dashboard analytics

Docker deployment

Author

Sonaly Ganapathy
Full Stack Developer
Tech Stack: ASP.NET Core | Angular | SQL Server
