# Candidate API Documentation - Job Portal

This document outlines the RESTful API endpoints required for the Candidate module of the Job Portal. All endpoints expect and return JSON, except where file uploads are involved.

## Base URL
`http://api.jobportal.com/v1`

---

## 1. Authentication
Endpoints for guest access and session management.

### Login
*   **Endpoint:** `/auth/login`
*   **Method:** `POST`
*   **Payload:** `{ "email": "...", "password": "..." }`
*   **Response:** `200 OK` with JSON Web Token (JWT) and user basics.

### Register
*   **Endpoint:** `/auth/register`
*   **Method:** `POST`
*   **Payload:** `{ "name": "...", "email": "...", "password": "...", "role": "candidate" }`
*   **Response:** `201 Created`

### Social Login (OAuth)
*   **Endpoint:** `/auth/social`
*   **Method:** `POST`
*   **Payload:** `{ "provider": "google|linkedin", "token": "..." }`
*   **Response:** `200 OK` with JWT.

### Forgot Password
*   **Endpoint:** `/auth/forgot-password`
*   **Method:** `POST`
*   **Payload:** `{ "email": "..." }`
*   **Response:** `200 OK` (Trigger email).

### Reset Password
*   **Endpoint:** `/auth/reset-password`
*   **Method:** `POST`
*   **Payload:** `{ "token": "...", "newPassword": "..." }`
*   **Response:** `200 OK`

### Logout
*   **Endpoint:** `/auth/logout`
*   **Method:** `POST`
*   **Description:** Invalidates the current user session/token.
*   **Response:** `200 OK`

---

## 2. Candidate Profile
Endpoints for managing the candidate's professional identity and resume builder data.

### Get Profile
*   **Endpoint:** `/candidate/profile`
*   **Method:** `GET`
*   **Response:** Full profile object (Bio, Education, Exp, Projects, etc.)

### Update Profile
*   **Endpoint:** `/candidate/profile`
*   **Method:** `PUT`
*   **Payload:** Partial or full profile object.
*   **Response:** `200 OK`

### Upload Profile Picture
*   **Endpoint:** `/candidate/profile/avatar`
*   **Method:** `POST`
*   **Content-Type:** `multipart/form-data`
*   **Field:** `avatar` (Image file)
*   **Response:** `200 OK` with new image URL.

### Manage Resumes
*   **Endpoint:** `/candidate/resumes`
*   **Method:** `GET` (List), `POST` (Upload new), `DELETE /:id` (Remove)
*   **Description:** Allows candidate to store multiple resumes.

---

## 3. Jobs & Search
Discovery endpoints with filtering and search logic.

### Search Jobs
*   **Endpoint:** `/jobs`
*   **Method:** `GET`
*   **Query Params:** 
    *   `q`: Search keyword (title/company)
    *   `location`: City or Remote
    *   `category`: Industry ID
    *   `type`: full-time, part-time, internship, etc.
    *   `salary_min`, `salary_max`: Numeric range
*   **Response:** Paginated list of jobs.

### Get Job Details
*   **Endpoint:** `/jobs/:id`
*   **Method:** `GET`
*   **Response:** Full job details including company info and related jobs.

---

## 4. Applications & Interviews
Tracking the recruitment lifecycle.

### Apply for Job
*   **Endpoint:** `/jobs/:id/apply`
*   **Method:** `POST`
*   **Payload:** `{ "resumeId": 1, "coverLetter": "..." }` OR `multipart/form-data` for direct upload.
*   **Response:** `201 Created`

### My Applications
*   **Endpoint:** `/candidate/applications`
*   **Method:** `GET`
*   **Response:** List of jobs with status history (Applied -> Interview -> Offer/Reject).

### Scheduled Interviews
*   **Endpoint:** `/candidate/interviews`
*   **Method:** `GET`
*   **Description:** Fetch upcoming technical rounds, HR calls, and mock tests.
*   **Response:**
    ```json
    [
      { "id": 1, "company": "...", "type": "Technical", "time": "2024-09-15T10:00:00Z", "link": "zoom.us/..." }
    ]
    ```

---

## 5. Dashboard & Interactions
Real-time feedback and engagement.

### Dashboard Stats
*   **Endpoint:** `/candidate/dashboard/stats`
*   **Method:** `GET`
*   **Response:** `{ "applied": 12, "saved": 5, "interviews": 2 }`

### Saved Jobs
*   **Endpoint:** `/candidate/saved-jobs`
*   **Method:** `GET` (List), `POST /:jobId` (Save), `DELETE /:jobId` (Unsave)

### Notifications
*   **Endpoint:** `/candidate/notifications`
*   **Method:** `GET`, `PATCH /:id/read` (Mark as read), `DELETE /all` (Clear)

---

## 6. Mock Tests & Assessments
Skills verification system.

### Get Mock Test
*   **Endpoint:** `/candidate/tests/:id`
*   **Method:** `GET`
*   **Response:** Questions and options.

### Submit Test
*   **Endpoint:** `/candidate/tests/:id/submit`
*   **Method:** `POST`
*   **Payload:** `{ "answers": { "q1": "a", "q2": "c" } }`

---

## 7. Configuration & Support
Platform preferences and help.

### User Settings
*   **Endpoint:** `/candidate/settings`
*   **Method:** `GET`, `PUT`
*   **Fields:** `emailNotifications`, `jobAlerts`, `profileVisibility`.

### Job Alerts
*   **Endpoint:** `/candidate/alerts`
*   **Method:** `GET` (List), `POST` (Create new), `DELETE /:id`
*   **Payload:** `{ "keyword": "Frontend", "location": "Remote", "frequency": "daily" }`

### Support Tickets
*   **Endpoint:** `/support/tickets`
*   **Method:** `GET` (Status), `POST` (Create)
