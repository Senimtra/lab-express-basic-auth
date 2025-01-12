// ### Create route guard ###
const routeGuardMiddleware = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    const error = new Error('UNAUTHORIZED');
    error.status = 401;
    next(error);
  }
};

// ### Export route guard ###
module.exports = routeGuardMiddleware;
