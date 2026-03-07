# Task Manager API

A RESTful backend for managing tasks, users, and comments — built with **Express 5**, **TypeScript**, **Prisma**, and **SQLite**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Tasks](#tasks)
  - [Comments](#comments)
  - [Users](#users)
- [Error Responses](#error-responses)

---

## Project Overview

| Layer          | Technology              |
| -------------- | ----------------------- |
| Runtime        | Node.js + tsx           |
| Framework      | Express 5               |
| Language       | TypeScript              |
| ORM            | Prisma (driver adapter) |
| Database       | SQLite (better-sqlite3) |
| Validation     | Zod v4                  |

### Data Models

| Model     | Key Fields                                                                 |
| --------- | -------------------------------------------------------------------------- |
| **User**  | `id`, `name`, `createdAt`, `updatedAt`                                     |
| **Task**  | `id`, `title`, `description?`, `status`, `priority`, `category`, `startDate?`, `dueDate?`, `archived`, `ownerId?` |
| **Comment** | `id`, `message`, `createdAt`, `taskId`                                   |

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file (see Environment Variables below)

# 3. Run database migrations
npm run migrate

# 4. (Optional) Seed sample data
npm run seed

# 5. Start the dev server (auto-reload)
npm run dev
```

The server starts at `http://localhost:<PORT>` (default `3001`).

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
DATABASE_URL="file:./dev.db"
```

| Variable       | Required | Description                      | Default        |
| -------------- | -------- | -------------------------------- | -------------- |
| `PORT`         | No       | Port the server listens on       | `undefined`    |
| `DATABASE_URL` | No       | SQLite database file path        | `file:./dev.db` |

---

## API Endpoints

**Base URL:** `/api`

### Tasks

#### List Tasks

```
GET /api/tasks
```

Paginated, filterable, sortable list of tasks.

**Query Parameters:**

| Parameter  | Type    | Default     | Description                                              |
| ---------- | ------- | ----------- | -------------------------------------------------------- |
| `page`     | integer | `1`         | Page number                                              |
| `limit`    | integer | `10`        | Items per page (max 100)                                 |
| `status`   | string  | —           | Filter by status: `BACKLOG`, `IN_PROGRESS`, `BLOCKED`, `DONE` |
| `priority` | string  | —           | Filter by priority: `LOW`, `MEDIUM`, `HIGH`, `URGENT`    |
| `category` | string  | —           | Filter by category: `BACKEND`, `FRONTEND`, `DEVOPS`      |
| `archived` | boolean | `false`     | Include archived tasks                                   |
| `ownerId`  | integer | —           | Filter by owner ID                                       |
| `search`   | string  | —           | Search in title and description                          |
| `sortBy`   | string  | `createdAt` | Sort field: `createdAt`, `updatedAt`, `startDate`, `dueDate`, `priority`, `status`, `category`, `title` |
| `order`    | string  | `desc`      | Sort order: `asc`, `desc`                                |

**Example Request:**

```
GET /api/tasks?page=1&limit=5&status=IN_PROGRESS&sortBy=dueDate&order=asc
```

**Example Response:** `200 OK`

```json
{
  "data": [
    {
      "id": 2,
      "title": "Implement REST API endpoints",
      "description": "Build all CRUD endpoints for tasks.",
      "status": "IN_PROGRESS",
      "priority": "URGENT",
      "category": "BACKEND",
      "startDate": "2026-03-05T00:00:00.000Z",
      "dueDate": "2026-03-15T00:00:00.000Z",
      "archived": false,
      "createdAt": "2026-03-05T01:40:24.000Z",
      "updatedAt": "2026-03-05T01:40:24.000Z",
      "ownerId": 1,
      "owner": { "id": 1, "name": "Alice Johnson" },
      "_count": { "comments": 3 }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  }
}
```

---

#### Get Task by ID

```
GET /api/tasks/:id
```

Returns a single task with owner details and all comments.

**Path Parameters:**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Task ID     |

**Example Request:**

```
GET /api/tasks/2
```

**Example Response:** `200 OK`

```json
{
  "data": {
    "id": 2,
    "title": "Implement REST API endpoints",
    "description": "Build all CRUD endpoints for tasks.",
    "status": "IN_PROGRESS",
    "priority": "URGENT",
    "category": "BACKEND",
    "startDate": "2026-03-05T00:00:00.000Z",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "archived": false,
    "createdAt": "2026-03-05T01:40:24.000Z",
    "updatedAt": "2026-03-05T01:40:24.000Z",
    "ownerId": 1,
    "owner": { "id": 1, "name": "Alice Johnson" },
    "comments": [
      {
        "id": 1,
        "message": "Schema looks good, moving to implementation.",
        "createdAt": "2026-03-05T01:40:24.000Z",
        "taskId": 2
      }
    ]
  }
}
```

---

#### Create Task

```
POST /api/tasks
```

**Request Body:**

| Field         | Type    | Required | Description                                      |
| ------------- | ------- | -------- | ------------------------------------------------ |
| `title`       | string  | Yes      | Task title (1–255 chars)                         |
| `description` | string  | No       | Task description (max 2000 chars)                |
| `status`      | string  | No       | `BACKLOG` (default), `IN_PROGRESS`, `BLOCKED`, `DONE` |
| `priority`    | string  | No       | `LOW`, `MEDIUM` (default), `HIGH`, `URGENT`      |
| `category`    | string  | No       | `BACKEND` (default), `FRONTEND`, `DEVOPS`        |
| `startDate`   | string  | No       | ISO 8601 date string                             |
| `dueDate`     | string  | No       | ISO 8601 date string                             |
| `ownerId`     | integer | No       | ID of the assigned user                          |

**Example Request:**

```json
POST /api/tasks
Content-Type: application/json

{
  "title": "Write API documentation",
  "description": "Generate README and OpenAPI spec.",
  "priority": "HIGH",
  "category": "BACKEND",
  "ownerId": 1,
  "startDate": "2026-03-18",
  "dueDate": "2026-03-20"
}
```

**Example Response:** `201 Created`

```json
{
  "data": {
    "id": 8,
    "title": "Write API documentation",
    "description": "Generate README and OpenAPI spec.",
    "status": "BACKLOG",
    "priority": "HIGH",
    "category": "BACKEND",
    "startDate": "2026-03-18T00:00:00.000Z",
    "dueDate": "2026-03-20T00:00:00.000Z",
    "archived": false,
    "createdAt": "2026-03-06T10:00:00.000Z",
    "updatedAt": "2026-03-06T10:00:00.000Z",
    "ownerId": 1,
    "owner": { "id": 1, "name": "Alice Johnson" }
  }
}
```

---

#### Update Task

```
PATCH /api/tasks/:id
```

Partially update any task fields. Only include fields you want to change.

**Path Parameters:**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Task ID     |

**Request Body:** (all fields optional)

| Field         | Type           | Description                                      |
| ------------- | -------------- | ------------------------------------------------ |
| `title`       | string         | Task title (1–255 chars)                         |
| `description` | string \| null | Task description (max 2000 chars), null to clear |
| `status`      | string         | `BACKLOG`, `IN_PROGRESS`, `BLOCKED`, `DONE`      |
| `priority`    | string         | `LOW`, `MEDIUM`, `HIGH`, `URGENT`                |
| `category`    | string         | `BACKEND`, `FRONTEND`, `DEVOPS`                  |
| `startDate`   | string \| null | ISO 8601 date, null to clear                     |
| `dueDate`     | string \| null | ISO 8601 date, null to clear                     |
| `ownerId`     | integer \| null | User ID, null to unassign                       |

**Example Request:**

```json
PATCH /api/tasks/2
Content-Type: application/json

{
  "status": "DONE",
  "priority": "MEDIUM"
}
```

**Example Response:** `200 OK`

```json
{
  "data": {
    "id": 2,
    "title": "Implement REST API endpoints",
    "description": "Build all CRUD endpoints for tasks.",
    "status": "DONE",
    "priority": "MEDIUM",
    "category": "BACKEND",
    "startDate": "2026-03-05T00:00:00.000Z",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "archived": false,
    "createdAt": "2026-03-05T01:40:24.000Z",
    "updatedAt": "2026-03-06T10:05:00.000Z",
    "ownerId": 1,
    "owner": { "id": 1, "name": "Alice Johnson" },
    "comments": []
  }
}
```

---

#### Archive Task

```
PATCH /api/tasks/:id/archive
```

Soft-archive a task (sets `archived: true`). No request body needed.

**Path Parameters:**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Task ID     |

**Example Request:**

```
PATCH /api/tasks/5/archive
```

**Example Response:** `200 OK`

```json
{
  "data": {
    "id": 5,
    "title": "Some old task",
    "archived": true,
    "owner": { "id": 2, "name": "Bob Smith" }
  }
}
```

---

### Comments

Comments are nested under tasks.

#### Add Comment

```
POST /api/tasks/:id/comments
```

**Path Parameters:**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Task ID     |

**Request Body:**

| Field     | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `message` | string | Yes      | Comment text (1–2000 chars)    |

**Example Request:**

```json
POST /api/tasks/2/comments
Content-Type: application/json

{
  "message": "Endpoints are looking great, just need tests."
}
```

**Example Response:** `201 Created`

```json
{
  "data": {
    "id": 4,
    "message": "Endpoints are looking great, just need tests.",
    "createdAt": "2026-03-06T10:10:00.000Z",
    "taskId": 2
  }
}
```

---

#### List Comments for a Task

```
GET /api/tasks/:id/comments
```

Returns all comments for a task, ordered by creation time (oldest first).

**Path Parameters:**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | Task ID     |

**Example Request:**

```
GET /api/tasks/2/comments
```

**Example Response:** `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "message": "Schema looks good, moving to implementation.",
      "createdAt": "2026-03-05T01:40:24.000Z",
      "taskId": 2
    },
    {
      "id": 4,
      "message": "Endpoints are looking great, just need tests.",
      "createdAt": "2026-03-06T10:10:00.000Z",
      "taskId": 2
    }
  ]
}
```

---

### Users

#### List Users

```
GET /api/users
```

Returns all users sorted alphabetically by name.

**Example Request:**

```
GET /api/users
```

**Example Response:** `200 OK`

```json
{
  "data": [
    { "id": 1, "name": "Alice Johnson" },
    { "id": 2, "name": "Bob Smith" },
    { "id": 3, "name": "Charlie Brown" }
  ]
}
```

---

#### Get User by ID

```
GET /api/users/:id
```

**Path Parameters:**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `id`      | integer | User ID     |

**Example Request:**

```
GET /api/users/1
```

**Example Response:** `200 OK`

```json
{
  "data": {
    "id": 1,
    "name": "Alice Johnson"
  }
}
```

---

#### Create User

```
POST /api/users
```

**Request Body:**

| Field  | Type   | Required | Description              |
| ------ | ------ | -------- | ------------------------ |
| `name` | string | Yes      | User name (1–100 chars)  |

**Example Request:**

```json
POST /api/users
Content-Type: application/json

{
  "name": "Diana Prince"
}
```

**Example Response:** `201 Created`

```json
{
  "data": {
    "id": 4,
    "name": "Diana Prince"
  }
}
```

---

## Error Responses

All errors follow a consistent JSON structure:

```json
{
  "message": "Human-readable error description",
  "errorCode": 1001
}
```

### HTTP Status Codes

| Status | Meaning                | When                                      |
| ------ | ---------------------- | ----------------------------------------- |
| `200`  | OK                     | Successful read / update                  |
| `201`  | Created                | Resource created successfully             |
| `204`  | No Content             | CORS preflight (`OPTIONS`)                |
| `404`  | Not Found              | Resource with given ID does not exist      |
| `422`  | Unprocessable Entity   | Request validation failed                 |
| `500`  | Internal Server Error  | Unexpected server error                   |

### Error Codes

| Code   | Meaning              |
| ------ | -------------------- |
| `1001` | User not found       |
| `2001` | Task not found       |
| `3001` | Comment not found    |
| `4000` | Bad request          |
| `4001` | Validation error     |
| `5000` | Internal error       |

### Validation Error Example

```
POST /api/tasks
Content-Type: application/json

{ "title": "" }
```

**Response:** `422 Unprocessable Entity`

```json
{
  "message": "Validation failed",
  "errorCode": 4001,
  "errors": {
    "title": ["String must contain at least 1 character(s)"]
  }
}
```

### Not Found Error Example

```
GET /api/tasks/99999
```

**Response:** `404 Not Found`

```json
{
  "message": "Task not found",
  "errorCode": 2001
}
```
