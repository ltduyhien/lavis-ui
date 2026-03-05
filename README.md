Main feature work:

- Build UI flows around these endpoints:
    - POST /token: Login with alice/bob/charlie + password 1234 to obtain an access token.
    - GET /users: List all users (requires Authorization: Bearer <token>).
    - GET /users/<user_id>: View a user profile including password (for yourself).
    - POST /users/<user_id>: Update your own profile (name and password).
    - GET /acquisitions: List last month’s satellite acquisitions (timestamp, sites), ideal for charts/histograms to visualize ore sites over time.
- Reporting / analysis:
    - In your README, discuss possible backend improvements (e.g., security, validation, error handling, schema design, auth model) and what you would enhance in the frontend if you had more time (UX polish, responsiveness, accessibility, advanced data viz, state management, etc.).


