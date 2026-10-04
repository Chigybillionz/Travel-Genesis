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

- [x] **Task 1.1: Initialize Project**
  - Run `npm init -y` in a new `backend` folder.
  - Install core dependencies: `express`, `cors`, `dotenv`, `helmet`, `morgan`.
  - Set up `server.js` as the entry point.
- [x] **Task 1.2: Establish Folder Architecture**
  - Create the following directories:
    - `/routes` (Defines API endpoints)
    - `/controllers` (Handles HTTP requests/responses)
    - `/services` (Contains core business logic)
    - `/models` (Database schemas)
    - `/middlewares` (Auth checks, error handling)
- [x] **Task 1.3: Database Connection**
  - Provision MongoDB with Mongoose connection logic in `/config/db.js`.
  - Configured `.env` and `.env.example` with fallback handling.
- [x] **Task 1.4: Global Error Handling**
  - Central error-handling and 404 middleware in `/middlewares/errorHandler.js`.

---

## Phase 2: Authentication & User Profiles
*Matches Frontend: `pages/auth/login`, `pages/auth/signup`, `pages/user/profile`*

- [x] **Task 2.1: User Model**
  - Defined schema with bcrypt password hashing in `/models/User.js`.
- [x] **Task 2.2: Auth Endpoints**
  - `POST /api/auth/register`: Hash password and create user with JWT token.
  - `POST /api/auth/login`: Verify credentials and issue JWT token.
  - `GET /api/auth/me`: Fetch authenticated user.
- [x] **Task 2.3: Auth Middleware**
  - Created `protect` middleware in `/middlewares/auth.js` to verify JWT and attach user.
- [x] **Task 2.4: Profile Endpoints**
  - `GET /api/users/profile`: Fetch current user profile.
  - `PUT /api/users/profile`: Update user profile details (name, email, location, avatar).

---

## Phase 3: Flights & Explore Engine
*Matches Frontend: `pages/booking/home`, `pages/booking/search`, `pages/user/explore`*

- [x] **Task 3.1: Flight & Destination Models**
  - Defined Flight schema in `/models/Flight.js`.
  - Defined Destination schema in `/models/Destination.js`.
- [x] **Task 3.2: Search API**
  - `GET /api/flights/search`: Accept query parameters (`?from=LOS&to=LHR&date=...&flightClass=...`) and return matching flights.
  - `GET /api/flights`: List all available flights.
- [x] **Task 3.3: Explore/Recommendations API**
  - `GET /api/destinations/explore`: Return curated/trending destinations.
  - `GET /api/destinations/:id`: Destination details.
- [x] **Task 3.4: Flight Details API**
  - `GET /api/flights/:id`: Return specific flight details for flight details page.

---

## Phase 4: Bookings & Trip Management
*Matches Frontend: `pages/trips/trip-list`, `pages/booking/flight-details`*

- [x] **Task 4.1: Booking Model**
  - Defined schema in `/models/Booking.js` with references to User and Flight.
- [x] **Task 4.2: Create Booking API**
  - `POST /api/bookings`: Link flight to authenticated user and create confirmed booking.
- [x] **Task 4.3: My Trips API**
  - `GET /api/bookings/my-trips`: Fetch all bookings for logged-in user with flight details.
- [x] **Task 4.4: Cancel Booking API**
  - `PATCH /api/bookings/:id/cancel`: Update booking status to "Cancelled".

---

## Phase 5: Notifications
*Matches Frontend: `pages/user/notifications/notification.html`*

- [x] **Task 5.1: Notification Model**
  - Defined schema in `/models/Notification.js`.
- [x] **Task 5.2: Notification Endpoints**
  - `GET /api/notifications`: Fetch user notifications and unread count.
  - `PATCH /api/notifications/:id/read`: Mark notification as read.
  - `PATCH /api/notifications/read-all`: Mark all notifications as read.
- [x] **Task 5.3: System Triggers**
  - Automated notification triggers wired into `bookingService` for booking confirmations and cancellations.

---

## Phase 6: Frontend-to-Backend Integration
*Goal: Wire up client-side HTML/JS views to the live Express API.*

- [x] **Task 6.1: Shared API Client & Auth State**
  - Implemented `frontend/shared/js/api.js` for centralized HTTP requests with Bearer token authentication, user session caching, and error handling.
- [x] **Task 6.2: Sign Up Integration**
  - Integrated `frontend/pages/auth/signup/signup.js` with `POST /api/auth/register`, including form loading states and server validation handling.
- [x] **Task 6.3: Sign In Integration**
  - Integrated `frontend/pages/auth/login/login.js` with `POST /api/auth/login`, JWT storage, and direct navigation to home/dashboard.
- [x] **Task 6.4: Profile & Session Integration**
  - Connected `frontend/pages/user/profile/profile.js` to `GET /api/users/profile` for dynamic profile data retrieval.
  - Connected `frontend/pages/user/logout/logout.js` to clear session via `api.logout()`.
- [x] **Task 6.5: Flights Search & Booking Integration**
  - **Backend API & Service:**
    - Seeded full catalog of 10 international flight routes in MongoDB (`seed.js`) covering London (LHR), Dubai (DXB), Paris (CDG), New York (JFK), Sydney (SYD), Toronto (YYZ), Tokyo (NRT), Rome (FCO), Barcelona (BCN), and Santorini (JTR).
    - Upgraded `bookingService.js` to dynamically resolve flights by MongoDB ObjectId, flight code (`flightNumber`), or destination city name, ensuring rock-solid booking creation without CastErrors.
    - Automated event notifications: booking creation triggers confirmed trip alerts (`Booking Confirmed! 🎉`), and cancellations trigger confirmation notices (`Booking Cancelled`).
    - Verified live REST API endpoints: `GET /api/flights/search`, `POST /api/bookings`, `GET /api/bookings/my-trips`, and `PATCH /api/bookings/:id/cancel`.
  - **Frontend Client Integration:**
    - Configured dynamic destination-driven routing: clicking "Book Now" for any destination (Sydney, Toronto, London, New York, etc.) on `pages/booking/home` dynamically updates the "Choose flight" page with accurate route headers and distinct flight schedules, timings, durations, and airlines.
    - Added interactive destination pill selector on `pages/booking/flight-details` for smooth on-the-fly route switching.
    - Connected `pages/payment/checkout` to `POST /api/bookings` for real confirmed booking creation linked to the user account.
    - Connected `pages/trips/trip-list` to `GET /api/bookings/my-trips` and `PATCH /api/bookings/:id/cancel` for live booking management.
    - Connected `pages/booking/search` to route search queries directly to matching destination flight schedules.
    - Synced `pages/booking/booking-details` and `pages/trips/e-ticket` to display route-specific destination, airline, and flight timings.
- [ ] **Task 6.6: Notifications Integration**
  - Connect `pages/user/notifications` to `/api/notifications`.

---

## Service Configuration & Ports
- **Backend API Server:** `http://localhost:5001` (running via Express & MongoDB)
- **Frontend App Server:** `http://localhost:3000` (serving static pages & assets)