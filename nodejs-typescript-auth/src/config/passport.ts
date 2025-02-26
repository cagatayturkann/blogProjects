import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';
import UserModel from '../models/user.model';
import { IJwtPayload } from '../interfaces/user.interface';

// Configure passport strategies
export const configurePassport = (): void => {
  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: IJwtPayload, done) => {
      try {
        // Find user by ID from JWT payload
        const user = await UserModel.findById(payload.id);
        
        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  // Google OAuth Strategy
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await UserModel.findOne({ googleId: profile.id });

            if (!user) {
              // Create new user if not exists
              user = await UserModel.create({
                googleId: profile.id,
                email: profile.emails?.[0]?.value || `${profile.id}@google.com`,
                name: profile.displayName || 'Google User',
                profilePicture: profile.photos?.[0]?.value || '',
              });
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }
}; 