const router = require('express').Router();
const passport = require('../config/passport');
const requireAuth = require('../middleware/requireAuth');

router.get('/login', (req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StockFlow Sign In</title>
        <style>
          :root {
            color-scheme: light;
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            min-height: 100vh;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(160deg, #eef4ff 0%, #f7fbff 55%, #f2fff8 100%);
            color: #10243e;
            display: grid;
            place-items: center;
            padding: 20px;
          }
          .card {
            width: 100%;
            max-width: 480px;
            background: #ffffff;
            border: 1px solid #d9e5f8;
            border-radius: 16px;
            box-shadow: 0 14px 40px rgba(8, 32, 66, 0.12);
            padding: 28px;
          }
          h1 {
            margin: 0 0 10px;
            font-size: 1.8rem;
            line-height: 1.2;
          }
          p {
            margin: 0;
            line-height: 1.5;
          }
          .desc {
            color: #304966;
            margin-bottom: 20px;
          }
          .btn {
            display: inline-block;
            width: 100%;
            text-align: center;
            text-decoration: none;
            background: #1f6feb;
            color: #ffffff;
            padding: 12px 16px;
            border-radius: 10px;
            font-weight: 600;
          }
          .btn:hover {
            background: #1858ba;
          }
          .note {
            margin-top: 12px;
            font-size: 0.92rem;
            color: #5a6f88;
          }
          .docs {
            display: inline-block;
            margin-top: 18px;
            color: #1f6feb;
            font-weight: 600;
            text-decoration: none;
          }
          .docs:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <main class="card">
          <h1>StockFlow API</h1>
          <p class="desc">Sign in to access protected routes.</p>
          <a class="btn" href="/auth/github">Sign in with GitHub</a>
          <a class="docs" href="/api-docs">Open Swagger Docs</a>
        </main>
      </body>
    </html>
  `);
});

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    if (!req.session) {
      res.clearCookie('connect.sid', { path: '/' });
      return res.status(200).json({ message: 'Logged out' });
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return res.status(500).json({ message: 'Logout failed' });
      }

      res.clearCookie('connect.sid', { path: '/' });
      return res.status(200).json({ message: 'Logged out' });
    });
  });
});

router.get('/me', requireAuth, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
