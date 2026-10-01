# Travel Genesis - Backend Implementation Plan

This document outlines the step-by-step roadmap for building the **Express.js** backend for Travel Genesis. The structure is specifically tailored to map directly to the features we have built on the frontend.

## Architecture Pattern
We will use a standard **Layered Architecture** (Routes -> Controllers -> Services -> Data Access) to keep the code clean, modular, and easy to maintain.

**Proposed Tech Stack:**
*   **Framework:** Node.js with Express.js
*   **Language:** TypeScript (Highly recommended for catching errors early) or standard JavaScript
*   **Database:** PostgreSQL (with Prisma ORM) or MongoDB (with Mongoose). *PostgreSQL is recommended for booking systems requiring strict data relations.*
*   **Auth:** JWT (JSON Web Tokens)

---

## Phase 1: Project Setup & Core Structure
*Goal: Initialize the Express backend and establish the folder structure.*

- [ ] **Task 1.1: Initialize Project**
  - Run `npm init -y` in a new `backend` folder.
  - Install core dependencies: `express`, `cors`, `dotenv`, `helmet`, `morgan`.
  - Set up `server.js` (or `index.ts`) as the entry point.
- [ ] **Task 1.2: Establish Folder Architecture**
  - Create the following directories:
    - `/routes` (Defines API endpoints)
    - `/controllers` (Handles HTTP requests/responses)
    - `/services` (Contains core business logic)
    - `/models` (Database schemas)
    - `/middlewares` (Auth checks, error handling)
- [ ] **Task 1.3: Database Connection**
  - Provision a database (e.g., Supabase, MongoDB Atlas, or local Postgres).
  - Write connection logic in a `/config/db.js` file and test the connection.
- [ ] **Task 1.4: Global Error Handling**
  - Create a central error-handling middleware to catch and format API errors cleanly.

---

## Phase 2: Authentication & User Profiles
*Matches Frontend: `pages/auth/login`, `pages/auth/signup`, `pages/user/profile`*

- [ ] **Task 2.1: User Model**
  - Define schema: `id`, `name`, `email`, `passwordHash`, `avatarUrl`, `location`, `createdAt`.
- [ ] **Task 2.2: Auth Endpoints**
  - `POST /api/auth/register`: Hash password (using `bcrypt`) and save user.
  - `POST /api/auth/login`: Verify credentials and issue a JWT token.
- [ ] **Task 2.3: Auth Middleware**
  - Create `verifyToken` middleware in `/middlewares/auth.js` to protect private routes.
- [ ] **Task 2.4: Profile Endpoints**
  - `GET /api/users/profile`: Fetch current logged-in user data.
  - `PUT /api/users/profile`: Update user details (e.g., changing "Lagos, Nigeria" location).

---

## Phase 3: Flights & Explore Engine
*Matches Frontend: `pages/booking/home`, `pages/booking/search`, `pages/user/explore`*

- [ ] **Task 3.1: Flight & Destination Models**
  - Define Flight schema: `flightNumber`, `origin`, `destination`, `departureTime`, `arrivalTime`, `price`, `airline`.
  - Define Destination schema (for Explore page): `name`, `imageUrl`, `rating`, `description`.
- [ ] **Task 3.2: Search API**
  - `GET /api/flights/search`: Accept query parameters (`?from=LOS&to=LDN&date=...`) and return matching flights.
- [ ] **Task 3.3: Explore/Recommendations API**
  - `GET /api/destinations/explore`: Return a list of curated/trending destinations to populate the "Tailored for your Journey" cards.
- [ ] **Task 3.4: Flight Details API**
  - `GET /api/flights/:id`: Return specific flight details for the Flight Details page.

---

## Phase 4: Bookings & Trip Management
*Matches Frontend: `pages/trips/trip-list`, `pages/booking/flight-details`*

- [ ] **Task 4.1: Booking Model**
  - Define schema: `id`, `userId`, `flightId`, `status` (Pending, Confirmed, Cancelled), `bookingDate`, `seatNumber`.
- [ ] **Task 4.2: Create Booking API**
  - `POST /api/bookings`: Accept flight ID, link it to the authenticated user, and create a "Pending" or "Confirmed" booking.
- [ ] **Task 4.3: My Trips API**
  - `GET /api/bookings/my-trips`: Fetch all bookings for the logged-in user, populated with flight data (to display LOS ➔ LDN cards).
- [ ] **Task 4.4: Cancel Booking API**
  - `PATCH /api/bookings/:id/cancel`: Update booking status to "Cancelled" (triggering the "Cancel Booking" button on the UI).

---

## Phase 5: Notifications
*Matches Frontend: `pages/user/notifications/notification.html`*

- [ ] **Task 5.1: Notification Model**
  - Define schema: `userId`, `title`, `message`, `isRead`, `createdAt`.
- [ ] **Task 5.2: Notification Endpoints**
  - `GET /api/notifications`: Fetch user's notifications.
  - `PATCH /api/notifications/:id/read`: Mark a specific notification as read.
- [ ] **Task 5.3: System Triggers**
  - Set up logic in the Booking Service to automatically create a notification when a booking is confirmed or cancelled.

---

## Next Steps to Begin:
Once you are ready to start, we will:
1. Create a `backend` folder alongside your `pages` and `shared` folders.
2. Initialize `package.json` and install Express.
3. Write the initial `server.js` file to get your `localhost:5000` server running.
