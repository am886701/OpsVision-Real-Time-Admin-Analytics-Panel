# Admin Dashboard with Analytics and Reporting

This project upgrades the original task manager into an admin-focused dashboard with analytics, reporting, secure authentication, and management controls.

## Features

- Responsive admin dashboard for desktop and mobile
- JWT-based authentication
- Role-based authorization for administrator-only routes
- Analytics cards for active users, sign-ups, completion rate, overdue work, and alerts
- Real-time charts using `recharts`
- User management controls for editing, enabling/disabling, promoting, and deleting users
- Content management controls for creating tasks, updating stages, and archiving items
- First-user bootstrap flow: the first registered user becomes the admin automatically

## Tech Stack

- MongoDB Atlas
- Express.js
- React + Vite
- Node.js
- Tailwind CSS
- Recharts

## Version Details

- Node.js used during setup: `v24.14.0`
- npm used during setup: `v11.9.0`
- Recommended minimum: Node.js `18+`, npm `9+`

## Local Setup

### 1. Open the project
### 2. Configure MongoDB Atlas
### 3. Create `server/.env`

Use this format:

```env
NODE_ENV=development
MONGODB_URI=<paste-your-atlas-connection-string-here>
JWT_SECRET=your_secure_secret_here
PORT=8800
```
### 4. Install dependencies
### 5. Start the backend
### 6. Start the frontend
### 7. Open the app

## How to View the Database in MongoDB Atlas

1. Open MongoDB Atlas.
2. Go to your project.
3. Click `Database` > `Clusters`.
4. On your cluster, click `Browse Collections`.

After you register a user or create tasks from the app, you should see a database like:

- `admin_dashboard`

And collections such as:

- `users`
- `tasks`
- `notices`

## Run Commands Summary

Frontend URL:

- [http://localhost:5173](http://localhost:5173)

## Main API Routes

### User and Admin

- `POST /api/user/register`
- `POST /api/user/login`
- `POST /api/user/logout`
- `GET /api/user/analytics`
- `GET /api/user/all`
- `PUT /api/user/:id`
- `PATCH /api/user/:id`
- `DELETE /api/user/:id`

### Tasks and Content

- `POST /api/tasks/create`
- `GET /api/tasks`
- `GET /api/tasks/trash`
- `PUT /api/tasks/:id`
- `PUT /api/tasks/trash/:id`
- `PUT /api/tasks/restore/:id`
- `DELETE /api/tasks/delete/:id`

## Troubleshooting

### `Route not found: /` or `Route not found: /api`

This is normal if you open the backend directly in the browser.

Use:

- [http://localhost:5173](http://localhost:5173)

### `querySrv ECONNREFUSED _mongodb._tcp...`

Try these checks:

1. Verify the Atlas username and password.
2. Verify `Network Access` in Atlas.
3. Verify the connection string in `.env`.
4. Run:

```powershell
nslookup -type=SRV _mongodb._tcp.cluster0.9yv5kyx.mongodb.net
```

5. If SRV issues continue, use the non-SRV MongoDB connection string from Atlas.

### `users.findOne() buffering timed out`

This means the backend started, but MongoDB was not connected yet. Fix the database connection string or Atlas access settings first.

## Project Structure

```text
Task_Manager_System-main/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- redux/
|   |   `-- utils/
|-- server/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   `-- utils/
|-- README.md
`-- requirements.txt
```


