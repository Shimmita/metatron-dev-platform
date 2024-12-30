export function handleAuthMiddleware(req, res, next) {
  if (req.session.isOnline) {
    // continue with the request
    next();
  } else {
    // user session expired
    res.status(400).send({ login: true, message: "user session expired" });
  }
}
