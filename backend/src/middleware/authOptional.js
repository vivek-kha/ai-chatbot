import jwt from "jsonwebtoken";

export function authOptional(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = { id: payload.id, email: payload.email };
  } catch (err) {
    // ignore invalid tokens for optional auth
  }
  return next();
}

