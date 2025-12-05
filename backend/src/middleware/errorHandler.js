export function notFound(req, res, next) {
  res.status(404).json({ error: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    error: err.message || "Internal server error",
  });
}


