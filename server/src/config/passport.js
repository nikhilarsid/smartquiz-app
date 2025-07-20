import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';


const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', 
      },
      async (accessToken, refreshToken, profile, done) => {
        
        
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            
            done(null, user);
          } else {
            
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              
              done(new Error('Email already associated with a local account.'), null);
            } else {
              
              user = await User.create(newUser);
              done(null, user);
            }
          }
        } catch (err) {
          console.error('Error in Google OAuth strategy:', err);
          done(err, null);
        }
      }
    )
  );

  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default configurePassport;