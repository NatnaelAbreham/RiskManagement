# Risk Management System

A modern **Risk Management System (RMS)** built with **ASP.NET Core MVC** following a layered architecture. The application helps organizations identify, assess, monitor, and manage operational risks through a secure role-based workflow.

## Features

* User authentication using **Cookie Authentication**
* Role-based access control (Maker, Checker, Admin)
* Risk registration and management
* Risk approval and rejection workflow
* Dashboard with risk analytics and charts
* Risk reporting with filtering and export capabilities
* RESTful API endpoints for data retrieval
* Responsive and modern user interface
* Secure routing and authorization
* SQL Server database integration

## Technology Stack

### Backend

* ASP.NET Core MVC
* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* Cookie Authentication

### Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript (ES6)
* jQuery
* ApexCharts

## Project Architecture

The application combines **ASP.NET Core MVC** for rendering views with **REST APIs** for dynamic data loading. Client-side JavaScript communicates with API endpoints using `fetch()` to provide a responsive user experience.

```
Browser
    │
    ▼
ASP.NET Core MVC
    │
    ├── Controllers
    ├── Views
    ├── Models
    ├── Services
    └── APIs
          │
          ▼
Entity Framework Core
          │
          ▼
      SQL Server
```

## Authentication

The application uses **Cookie Authentication** provided by ASP.NET Core.

Features include:

* Secure login
* Authentication cookies
* Role-based authorization
* Protected routes
* Session management
* Automatic authorization checks

## User Roles

### Maker

* Register new risks
* Edit pending risks
* View submitted risks
* Track approval status

### Checker

* Review submitted risks
* Approve or reject risks
* Provide review comments
* Export to Excel/PDF
* View reports

### Admin

* Manage users
* Manage system settings
* View all risks
* Access dashboards and reports

## API

The project exposes API endpoints that are consumed by the MVC frontend.

Example:

```
GET /Checker/GetReportData
GET /Checker/GetUpcomingDeadlines
POST /Maker/CreateRisk
```

The frontend retrieves data asynchronously using JavaScript `fetch()`.

## Routing

The project uses ASP.NET Core routing to organize navigation between controllers and API endpoints.

Example:

```
/Account/Login
/Maker/Dashboard
/Maker/Register
/Checker/Record
/Checker/Reports
```

## Dashboard

The dashboard includes:

* Total Risks
* Open Risks
* Closed Risks
* Risk Rating Distribution
* Risk Category Analysis
* Status Distribution
* Upcoming Deadlines
* Trend Charts

## Database

The project uses **SQL Server** with **Entity Framework Core**.

Main entities include:

* Users
* Risk Registration
* Risk Categories
* Risk Ratings
* Approval History

## Getting Started

### Prerequisites

* Visual Studio 2022 or VS Code
* .NET 8 SDK
* SQL Server
* SQL Server Management Studio (optional)

### Installation

1. Clone the repository.

```bash
git clone https://github.com/NatnaelAbreham/RiskManagement.git
```

2. Navigate to the project directory.

```bash
cd RiskManagementSystem
```

3. Update the connection string in `appsettings.json`.

```json
"ConnectionStrings": {
  "DefaultConnection": "Your SQL Server Connection String"
}
```

4. Apply database migrations.

```bash
dotnet ef database update
```

5. Run the project.

```bash
dotnet run
```

6. Open your browser.

```
https://localhost:5001
```

## Security

* Cookie Authentication
* Authorization Policies
* Role-Based Access Control
* Server-side Validation
* Client-side Validation
* Anti-forgery Protection

## Screenshots

<img width="1301" height="713" alt="login page" src="https://github.com/user-attachments/assets/76cb10f8-f8b0-4f4e-8e5f-244af57d92ba" />
<img width="1284" height="711" alt="report" src="https://github.com/user-attachments/assets/c9d2f366-13c7-472b-8b73-2640eff69999" />
<img width="1287" height="712" alt="Risk Registration page" src="https://github.com/user-attachments/assets/622589d1-c60b-403e-8e5d-97584a34b007" />
<img width="1276" height="710" alt="Dashboard" src="https://github.com/user-attachments/assets/2cb32258-4509-452b-8db4-6d5b0153c0fc" />
<img width="1290" height="714" alt="approval page" src="https://github.com/user-attachments/assets/5ee14737-9a00-4b95-8714-5026078d69e3" />


## Future Improvements

* Email notifications
* Risk heat map
* File attachments
* Audit logs
* Multi-level approval workflow
* Notifications
* REST API documentation using Swagger

## License

...........................

## Author

Full Stack Developer

* ASP.NET Core MVC
* ASP.NET Core Web API
* SQL Server
* Entity Framework Core
* JavaScript
* Bootstrap

