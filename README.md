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

## Project Paths

- Root: `E:\projt\proj1\Task_Manager_System-main`
- Backend: `E:\projt\proj1\Task_Manager_System-main\server`
- Frontend: `E:\projt\proj1\Task_Manager_System-main\client`
- Environment file: `E:\projt\proj1\Task_Manager_System-main\server\.env`

## Local Setup

### 1. Open the project

```powershell
cd E:\projt\proj1\Task_Manager_System-main
```

### 2. Configure MongoDB Atlas

In MongoDB Atlas, make sure all of these are done:

1. Create a cluster.
2. Create a database user with `Read and write to any database`.
3. Add your IP in `Network Access`, or temporarily allow `0.0.0.0/0`.
4. Copy the connection string from `Connect > Drivers`.

Collections are created automatically by Mongoose, so you do not need to create them manually.

### 3. Create `server/.env`

Use this format:

```env
NODE_ENV=development
MONGODB_URI=mongodb://YOUR_USERNAME:YOUR_PASSWORD@ac-kxxyn32-shard-00-00.9yv5kyx.mongodb.net:27017,ac-kxxyn32-shard-00-01.9yv5kyx.mongodb.net:27017,ac-kxxyn32-shard-00-02.9yv5kyx.mongodb.net:27017/admin_dashboard?ssl=true&replicaSet=atlas-namhup-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=your_secure_secret_here
PORT=8800
```

Notes:

- Do not leave spaces around `=`
- Replace `YOUR_USERNAME` and `YOUR_PASSWORD`
- Keep the database name `admin_dashboard`
- If your password contains special characters like `@`, `#`, `/`, or `:`, URL-encode it
- Do not commit real credentials

### 4. Install dependencies

Backend:

```powershell
cd E:\projt\proj1\Task_Manager_System-main\server
npm install
```

Frontend:

```powershell
cd E:\projt\proj1\Task_Manager_System-main\client
npm install
```

### 5. Start the backend

```powershell
cd E:\projt\proj1\Task_Manager_System-main\server
npm start
```

Expected backend logs:

```text
DB connection established
Server listening on 8800
```

### 6. Start the frontend

Open a second terminal:

```powershell
cd E:\projt\proj1\Task_Manager_System-main\client
npm run dev
```

### 7. Open the app

Open the frontend in your browser:

- [http://localhost:5173](http://localhost:5173)

Important:

- `http://localhost:8800` is only the backend server
- `http://localhost:8800/` and `http://localhost:8800/api` are not the main app pages

### 8. First login flow

- If the database is empty, register a new account from the login page
- The first registered user becomes the admin
- Then sign in and use the dashboard

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

Backend:

```powershell
cd E:\projt\proj1\Task_Manager_System-main\server
npm start
```

Frontend:

```powershell
cd E:\projt\proj1\Task_Manager_System-main\client
npm run dev
```

Frontend URL:

- [http://localhost:5173](http://localhost:5173)

## Build and Verification

Frontend production build:

```powershell
cd E:\projt\proj1\Task_Manager_System-main\client
npm run build
```

Notes:

- The frontend build was verified successfully
- Vite reported a large chunk warning, but the build completed

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

## Submission Note

The original repository was already built with React/Vite rather than Angular. To keep the implementation stable and aligned with the supplied codebase, the project was upgraded in its existing stack instead of being rewritten from scratch in Angular.
