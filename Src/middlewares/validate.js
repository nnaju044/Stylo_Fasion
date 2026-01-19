export const validate = (schema) => (req, res, next) => {
  if (!schema || typeof schema.safeParse !== "function") {
    return res.status(500).json({
      success: false,
      message: "Validation schema is invalid or undefined"
    });
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error?.issues || [];

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  req.body = result.data;
  next();
};
