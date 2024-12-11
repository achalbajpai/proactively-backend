# Speaker Session Booking Platform

A platform allowing users to book speaker sessions from available speaker listings. Built with **Typescript**.


<img width="1794" alt="Screenshot 2024-12-11 at 1 30 36 PM" src="https://github.com/user-attachments/assets/1138d7c4-5659-491e-af2f-d33ccf94b953">

## Index

1. [User and Speaker Profiles](#1-user-and-speaker-profiles-)
2. [Speaker Listing and Expertise](#2-speaker-listing-and-expertise-)
3. [Session Booking System](#3-session-booking-system-)
4. [Time Slot Blocking](#4-time-slot-blocking-)
5. [Notifications & Calendar](#5-notifications--calendar-)
6. [Testing](#testing)

## Problem Statement Features Implementation

### 1. User and Speaker Profiles ✅

-  **Signup with OTP Verification**
   -  User/Speaker registration with basic details
   -  Email-based OTP verification
   -  Account status tracking
-  **Login Authentication**
   -  Secure credential verification
   -  JWT token generation
   -  Role-based access control

### 2. Speaker Listing and Expertise ✅

-  **Profile Management**
   -  Expertise configuration
   -  Session pricing
   -  Protected routes for speakers
-  **Public Listing**
   -  View available speakers
   -  Expertise details
   -  Pricing information

### 3. Session Booking System ✅

-  **Time Slot Management**
   -  Available slots: 9 AM to 4 PM
   -  1-hour interval slots
   -  Real-time availability
-  **Booking Process**
   -  Authenticated booking
   -  Slot selection
   -  Instant confirmation

### 4. Time Slot Blocking ✅

-  **Double Booking Prevention**
   -  Real-time slot validation
   -  Database constraints
   -  Concurrent booking handling

### 5. Notifications & Calendar ✅

-  **Email Notifications**
   -  Booking confirmations
   -  OTP delivery
   -  Status updates
-  **Calendar Integration**
   -  Google Calendar events
   -  Attendee management
   -  Automatic reminders

## Tech Stack

-  **Backend Framework**: Node.js & Express.js
-  **Language**: TypeScript
-  **Database**: PostgreSQL
-  **Authentication**: JWT & OTP
-  **Email Service**: Nodemailer
-  **Calendar**: Google Calendar API

## Setup Instructions

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   cd speaker-session-booking
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Update .env with your configurations
   ```

3. **Database Setup**

   ```bash
   createdb speaker_booking
   npm run dev  # This will initialize the database tables
   ```

4. **Configure Services**
   -  Set up Gmail for OTP and notifications
   -  Configure Google Calendar API
   -  Update environment variables

## API Documentation

### Authentication

#### 1. User/Speaker Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "userType": "user | speaker"
}

Response: {
    "message": "User created successfully. Please verify your email with the OTP sent.",
    "userId": "number"
}
```
![IMG_4329](https://github.com/user-attachments/assets/966f41c7-4962-4eaf-a9ae-c231356dd597)

#### 2. OTP Verification

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
    "email": "string",
    "otp": "string"
}

Response: {
    "message": "Email verified successfully"
}
```
![IMG_4330](https://github.com/user-attachments/assets/1c20d0b5-e153-4ed2-bbe3-c8cfb5514852)

#### 3. Login

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}

Response: {
    "token": "string",
    "user": {
        "id": "number",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "userType": "string"
    }
}
```

### Speaker Management

#### 1. Create Speaker Profile (Protected - Speaker Only)

```http
POST /api/speakers/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "expertise": "string",
    "pricePerSession": "number",
    "bio": "string"
}

Response: {
    "message": "Speaker profile created successfully",
    "profile": {
        "id": "number",
        "expertise": "string",
        "pricePerSession": "number",
        "bio": "string"
    }
}
```

#### 2. Get All Speakers (Public)

```http
GET /api/speakers

Response: [
    {
        "id": "number",
        "expertise": "string",
        "pricePerSession": "number",
        "bio": "string",
        "firstName": "string",
        "lastName": "string"
    }
]
```

### Booking Management

#### 1. Get Available Slots (Protected)

```http
GET /api/bookings/slots?speakerId={id}&date={YYYY-MM-DD}
Authorization: Bearer {token}

Response: {
    "availableSlots": ["09:00", "10:00", ...]
}
```

#### 2. Create Booking (Protected - User Only)

```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
    "speakerId": "number",
    "date": "YYYY-MM-DD",
    "timeSlot": "HH:mm"
}

Response: {
    "message": "Booking created successfully",
    "booking": {
        "id": "number",
        "speakerId": "number",
        "date": "string",
        "timeSlot": "string",
        "status": "string"
    }
}
```
![IMG_4333](https://github.com/user-attachments/assets/96b9408a-9dd4-4507-992b-cfb9183118e5)

## Testing

Run the test suite to verify all functionalities:

```bash
# Database and Email Tests
ts-node src/testDb.ts
ts-node src/testEmail.ts
ts-node src/testEmailScenarios.ts

# Authentication and Profile Tests
ts-node src/testAuth.ts
ts-node src/testSpeaker.ts

# Booking and Calendar Tests
ts-node src/testBooking.ts
ts-node src/testCalendarIntegration.ts
```

![IMG_4332](https://github.com/user-attachments/assets/ca4d6213-f6e6-419d-a53e-450e1b81390e)
