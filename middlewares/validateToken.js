import passportJWT from "passport-jwt";
import passport from "passport";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;
const { ExtractJwt, Strategy } = passportJWT;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      if (!user || payload.exp <= Math.floor(Date.now() / 1000)) {
        return done(HttpError(401));
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

const validateToken = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (
      err ||
      !user ||
      !user.token ||
      user.token !== req.headers.authorization.split(" ")[1]
    ) {
      return next(HttpError(401));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default validateToken;
