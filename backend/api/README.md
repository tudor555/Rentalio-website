# Rentalio - API Documentation

This document provides an overview of the available **API** endpoints for the **Rentalio** backend service. The backend is built using **Node.js**, **Express**, and **MongoDB**, with **Mongoose** used for schema definitions and validation.

This **API** is consumed by the frontend client for listing, reservation, review, and user account management functionality.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication Cookie](#authentication-cookie)
3. [Listings](#listings)
4. [Reservations](#reservations)
5. [Users](#users)
6. [Authentication](#authentication)
7. [Reviews](#reviews)
8. [Flights](#flights)
9. [Payments](#payments)
10. [Error Handling](#error-handling)
11. [Status Codes](#status-codes)

## API Overview

- Base URL: `http://localhost:3000/`

- Content-Type: `application/json`

- Authentication: Specific endpoints require a valid session (token-based authentication can be added later).

- Response Format: **JSON**

## Authentication Cookie

The backend uses session-based authentication. After a successful login, the backend sets a session token via cookie:

```bash
Set-Cookie: USER-AUTH=<session_token>;
```

### How it works:

- This cookie is automatically sent with subsequent requests by the client.
- Protected endpoints (like reservations, user-specific listings, or reviews) require this session token to validate the request.

#### Notes:

- Ensure the cookie is sent with requests. For frontend usage (Angular), configure `withCredentials: true` in HTTP client settings.

```ts
// Angular/Frontend example
this.http.post("/reservations/add", payload, { withCredentials: true });
```

- Authentication middleware on the server validates the session token before allowing access.

## Listings

### `GET /listings`

Fetch all available listings.

Response:

```json
[
  {
    "location": {
      "country": "Romania",
      "city": "Oradea",
      "address": "123 Main Street"
    },
    "priceType": "day",
    "_id": "listing_id",
    "title": "Playground in Downtown",
    "description": "A beautiful playground in the heart of the city. Excellent for any kids no matter the age",
    "category": "playground",
    "basePrice": 50,
    "images": [],
    "amenities": ["parking place", "Air Conditioning"],
    "ownerId": "owner_id",
    "status": "active",
    "bookingsCount": 0,
    "averageRating": 0,
    "reviewCount": 0,
    "tags": ["fun", "kids", "downtown"],
    "createdAt": "creation_date"
  }
]
```

### `GET /listings/:id`

Fetch a specific listing by ID.

### `GET /listings/search?`

Fetch listings for a specific criteria

Available options:

```arduino
   - ?limit=number
   - ?city=string
   - ?priceType=day ("hour", "day", "week", "month", "year")
   - ?category=apartment&country=country
   - ?title=cozy&priceMin=100&priceMax=500
   - ?amenities=wifi,kitchen,parking
   - ?from=2025-05-01&to=2025-05-10
   - ?sort=price_asc (options: price_asc, price_desc, createdAt_asc, createdAt_desc, title_asc, title_desc)
  // All query parameters are optional and can be combined
  // Returns filtered and sorted listings based on query
```

### `POST /listings/add`

Create a new listing. (Admin or owner only)

```json
{
  "title": "Fottball field in centre",
  "description": "A beautiful fotball field near the heart of the city. Excellent for made a match with your friends, with view to river",
  "category": "playground",
  "basePrice": 50,
  "priceType": "hour",
  "images": [],
  "location": {
    "country": "Romania",
    "city": "Oradea",
    "address": "55 Main Street"
  },
  "amenities": ["ball", "t-shirts", "Wifi", "parking"],
  "ownerId": "owner_id",
  "tags": ["fun", "game", "friends", "downtown"]
}
```

### `PATCH /listings/:id`

Update a listing. (Admin or owner only)

### `DELETE /listings/:id`

Delete a listing. (Admin or owner only)

## Reservations

### `GET /reservations`

Return all reservations.

### `GET /reservations/:id`

Return reservation by ID.

### `POST /reservations/add`

Create a reservation.

Body:

```json
{
  "listingId": "listing_id",
  "userId": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "paymentMethod": "paypal",
  "priceType": "day",
  "startDate": "2025-06-01",
  "endDate": "2025-06-03",
  "ownerAmount": 200,
  "siteFee": 20,
  "totalAmount": 220
}
```

Optional for hourly listings:

```json
"numberOfHours": 2
```

If the listing is already booked for the selected dates, the API responds with:

```json
{
  "message": "Listing is already reserved for these dates"
}
```

### `PATCH /reservations/:id`

Update reservation status or dates.

    !! Only status, startDate and endDate are editable.

Body example:

```json
{
  "status": "confirmed",
  "startDate": "2025-05-02T00:00:00.000Z",
  "endDate": "2025-05-07T00:00:00.000Z"
}
```

### `DELETE /reservations/:id`

Deletes a reservation by ID. (Admin only)

## Users

### `GET /users`

Get all users. (Admin use)

### `GET /api/users/:id`

Fetch a user profile by ID.

### `PATCH /users`

Update user essential data like:

- username
- email
- phone

```json
{
  "username": "updated_name",
  "email": "new@gmail.com",
  "phone": "+40745555555"
}
```

### `PATCH /users/role-change/:id`

Change role of a user.

!! Promote user role from `visitor` to `owner`.

### `PATCH /users/:id/password`

Update password.

```json
{
  "email": "test3@gmail.com",
  "oldPassword": "oldPassword",
  "newPassword": "newStrongPassword"
}
```

### `DELETE /users/:id`

Delete a user by id. (Admin or owner only)

## Authentication

### `POST /auth/register`

Register a new user. <br>
Body example:

```json
{
  "username": "test",
  "email": "test@gmail.com",
  "role": "visitor",
  "phone": "0711111111",
  "password": "password",
  "profilePicture": "null"
}
```

### `POST /auth/login`

Login a user in website. <br>
Body example:

```json
{
  "email": "test@gmail.com",
  "password": "password"
}
```

Response: Sets the `USER-AUTH` cookie automatically.

## Reviews

Note: This section is not yet used in frontend. It may require some improvements to work as expected.

### `GET /reviews`

Fetch all reviews.

### `GET /reviews/:id`

Fetch review by id.

#### `POST /reviews/add`

Submit a new review. <br>
Body example:

```json
{
  "listingId": "listingId",
  "userId": "UserId",
  "rating": "4",
  "comment": "Beatiful place.Interesting."
}
```

Structure can be modify to add more fields like: user name, create date, etc.

#### `PATCH /reviews/:id`

Update a review.

#### `DELETE /reviews/:id`

Delete review by id.

## Flights

Flight search is integrated via [SerpAPI - Google Flights](https://serpapi.com/google-flights-api). <br>
The frontend includes a hardcoded flight example for UI demonstration.

### `POST /flights`

Body example:

```json
{
  "from": "Budapest",
  "destination": "London",
  "departureDate": "2025-05-10",
  "returnDate": "2025-05-20",
  "flightType": 1,
  "adults": 2,
  "childrens": 1
}
```

This is a read-only request. Flights are fetched externally, not stored in your database.

## Payments

Not fully implemented. Currently, the payment details are captured at the reservation level (paymentMethod).

## Error Handling

All error responses return a consistent structure:

```json
{
  "error": "Internal server error"
}
```

Or:

```json
{
  "message": "Descriptive error message"
}
```

## Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |
