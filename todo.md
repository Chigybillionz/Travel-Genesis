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
- [x] **Task 6.6: Notifications Integration**
  - Connected `frontend/pages/user/notifications/notification.html` and `notification.js` to `GET /api/notifications`, `PATCH /api/notifications/:id/read`, and `PATCH /api/notifications/read-all`.
  - Implemented interactive filter tabs ("All" and "Unread") with dynamic count badges and graceful empty states.
  - Added "Mark all read" header action with real-time UI updates and backend synchronization.
  - Integrated click-to-read interaction on individual notification cards with relative timestamps (e.g., "Just now", "2h ago", "Yesterday") and direct "View Trip" links for bookings.
  - Added live unread notification badge indicator to `#notification-btn` in `shared-nav.js` across the app.
  - Configured automatic welcome notification dispatch upon user registration in `authService.js`.

- [x] **Task 6.7: UI / UX Modern Desktop Redesign & Seat Selection Contrast Fix**
  - **Seat Selection Contrast & Legibility:**
    - Restored missing CSS variable tokens (`--color-primary`, `--color-primary-dark`, `--color-primary-ultralight`, `--color-accent`) in `seat.css`.
    - Transformed seat numbers from invisible washed-out text into crisp, high-contrast badges (Available: clean white with `#007A8C` teal text; Selected: solid `#007A8C` with bright white text and glow; Booked: soft gray with distinct slash indicators).
    - Integrated dynamic real-time seat summary bar displaying live selected seat numbers (e.g. `C1, B2`) and total price calculation.
  - **Desktop Notifications Screen Redesign:**
    - Eliminated all mobile traces (removed simulated phone battery/wifi status bar and iPhone home bar on desktop).
    - Integrated shared desktop navigation bar (`#shared-nav-container`) with sticky blur.
    - Designed expansive desktop dashboard layout (`max-width: 1080px`) featuring breadcrumbs, "Mark all as read" button, 3 stats overview cards ("Total Alerts", "Unread Messages", "Flight Sync Status"), filter tabs, and rich card feed.
  - **Desktop Explore Screen Redesign:**
    - Replaced bloated static SVG artwork with an interactive global travel discovery hub.
    - Added teal gradient hero banner with quick search filter input.
    - Added interactive community persona selectors ("All Travelers", "Leisure & Scenic (Age 50+)", "Executive Trips (Age 40+)", "Youth & Adventure").
    - Added category filters (Beaches, Historic, Luxury, Skylines) and curated high-resolution destination cards with ratings, prices, and direct flight booking links.
  - **Desktop Home Screen Redesign:**
    - Replaced cramped horizontal scroll cards with a full-width luxury travel experience.
    - Added modern Flight Booking Hero Banner with an interactive "Search Flights" widget.
    - Arranged popular destinations and curated packages into a balanced 4-column desktop grid with smooth hover elevation, rating badges, price tags, and direct flight detail deep links.
    - Added "Why Fly with Travel Genesis" trust section highlighting best price guarantee, instant e-tickets, flexible rescheduling, and 24/7 priority support.
    - Corrected destination label typos (e.g. "TRONTO" -> "Toronto").

- [x] **Task 6.9: Profile Photo Upload & Global Navigation Bar Synchronization**
  - Added interactive profile picture upload in the Edit Profile modal (`avatar-file-input` + camera overlay).
  - Integrated client-side canvas image compression to resize photos under 5MB to crisp, fast 320x320 thumbnails.
  - Added option to remove photo and revert to initials.
  - Updated backend Express json body limit to `10mb` to support avatar payloads.
  - Linked database profile update (`PUT /api/users/profile`) with `avatarUrl`.
  - Added live `tg:user-updated` custom event and `storage` listener to dynamically update the top navigation bar avatar and name across Home, Explore, My Trips, Notifications, and Settings without refreshing.

---

## Phase 7: Cloud Deployment & Backend Hosting (Render & MongoDB Atlas)
*Goal: Deploy the Node.js Express API to Render.com and connect to cloud MongoDB Atlas.*

- [ ] **Task 7.1: MongoDB Atlas Cloud Database Setup**
  - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (M0 Sandbox).
  - Create a database user and secure password.
  - In **Network Access**, add IP whitelist `0.0.0.0/0` (Allow access from anywhere).
  - Copy the connection string: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/travel_genesis?retryWrites=true&w=majority`.

- [ ] **Task 7.2: Render Web Service Configuration**
  - Connect GitHub repo on [Render.com](https://render.com) and create a **Web Service**.
  - **Root Directory:** `backend`
  - **Runtime:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - Configure Environment Variables on Render:
    - `NODE_ENV=production`
    - `PORT=10000`
    - `MONGO_URI=<your-mongodb-atlas-uri>`
    - `JWT_SECRET=travel_genesis_super_secret_jwt_key_2026_prod`
    - `JWT_EXPIRES_IN=7d`

- [ ] **Task 7.3: Database Seeding on Render**
  - Once the Render web service builds successfully, open the **Shell** tab in Render dashboard.
  - Run `npm run seed` to seed destinations and flights into the MongoDB Atlas database.

- [ ] **Task 7.4: Connect Vercel Frontend to Live Render API**
  - Copy the live Render backend URL (e.g. `https://travel-genesis-backend.onrender.com/api`).
  - Update `API_BASE_URL` in `frontend/shared/js/api.js` to point to the live Render endpoint for production.

---

## Service Configuration & Ports
- **Local Backend API Server:** `http://localhost:5001` (running via Express & MongoDB)
- **Local Frontend App Server:** `http://localhost:3000` (serving static pages & assets)
- **Live Frontend (Vercel):** Connected to GitHub repo
- **Live Backend (Render):** To be deployed via `backend` root