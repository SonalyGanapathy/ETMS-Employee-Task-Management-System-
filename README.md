# ETMS – Employee Task Management System

## Overview

ETMS (Employee Task Management System) is a web-based application designed to help organizations manage employee tasks and track progress efficiently.

The system allows administrators to assign tasks to employees, monitor task status, and manage task completion. Employees can log in, view assigned tasks, update progress, and mark tasks as completed.

This project is built using **ASP.NET Core Web API** following **Clean Architecture principles** to maintain a scalable and maintainable code structure.

---

## Key Features

* Employee authentication and login
* Task assignment by administrators
* Task status tracking
* Attendance management
* RESTful API endpoints for task and employee management
* Secure password hashing using BCrypt
* JWT-based authentication

---

## Technology Stack

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* SQL Server

### Security

* JWT Authentication
* BCrypt Password Hashing

### Architecture

* Clean Architecture
* Layered project structure

---

## Project Structure

The project follows **Clean Architecture** to separate responsibilities between layers.

ETMS
│
├── ETMS.API
│   ├── Controllers
│   ├── Services
│   ├── Program.cs
│   └── appsettings.json

├── ETMS.Application
│   └── Models

├── ETMS.Domain
│   └── Entities

├── ETMS.Infrastructure
│   └── Data Access

└── ETMS.sln

---

## System Architecture

Frontend (Angular)
↓
ASP.NET Core Web API
↓
Entity Framework Core
↓
SQL Server Database

---

## Installation & Setup

### Clone the repository

git clone https://github.com/YOUR_USERNAME/ETMS-Employee-Task-Management-System.git

### Open the solution

Open **ETMS.sln** in Visual Studio.

### Configure database

Update the connection string inside:

appsettings.json

### Run the project

Press **F5** or run the API using Visual Studio.

---

## Future Enhancements

* Role-based access control
* Task notifications
* Dashboard analytics
* Email alerts for task updates
* Mobile responsive UI improvements

---

## Author

Sonaly Ganapathy
