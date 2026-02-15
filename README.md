# stockflow-api

## Auth (GitHub OAuth + Session)

Set these environment variables locally in `.env` and in Render Environment:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `SESSION_SECRET`
- `CALLBACK_URL`

Local callback URL:

- `CALLBACK_URL=http://localhost:3000/auth/github/callback`

Render callback URL:

- `CALLBACK_URL=https://<your-render-service>.onrender.com/auth/github/callback`

### Testing protected routes

1. Visit `http://localhost:3000/login` and sign in with GitHub.
2. Open `http://localhost:3000/me` to confirm logged-in user JSON.
3. Log out at `http://localhost:3000/logout` (returns `{"message":"Logged out"}`).
4. Open `http://localhost:3000/me` again (should return `401` with `{"message":"Authentication required"}`).
5. Open `http://localhost:3000/api-docs` in the same browser session.
6. Run `POST`/`PUT`/`DELETE` on `/products` or `/customers` (should work when logged in).
7. Open an incognito/private window without login and run a protected route (should return `401` with `{"message":"Authentication required"}`).
