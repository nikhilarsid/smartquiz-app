import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/authController.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// --- Local Authentication Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);




router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    
    const token = generateToken(req.user._id);

    
    res.send(`
      <script>
        window.opener.postMessage({ 
          type: 'google-auth-success', 
          token: "${token}",
          user: ${JSON.stringify(req.user)}
        }, 'http://localhost:3000');
        window.close();
      </script>
    `);
  }
);

export default router;