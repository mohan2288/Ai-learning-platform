export const requireFields = (...fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};
