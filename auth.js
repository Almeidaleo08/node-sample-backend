import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";

module.exports = app => {
  const UserCompany = app.db.models.UserCompany;
  const Users = app.db.models.Users;
  const cfg = app.libs.config;
  const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
  };
  const strategy = new Strategy(params, (payload, done) => {
      if(payload.exp <= Date.now()){
        return done(null, false);
      }
        Users.findById(payload.user_id)
                .then(user => {
                  if (user) {
                        return done(null, {
                          id: user.id,
                          email: user.email, 
                        });
                      }
                  return done(null, false);
                })
                .catch(error => done(error, null));
    });

  passport.use(strategy);
  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: () => {
      return passport.authenticate("jwt", cfg.jwtSession);
    }
  };
};