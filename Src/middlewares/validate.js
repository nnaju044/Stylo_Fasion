export const validate = (schema) => (req, res, next) => {
  if (!schema || typeof schema.safeParse !== "function") {
    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Server Error",
      message: "Validation schema is invalid or undefined"
    };
    return res.redirect(req.get('referer') || '/');
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error?.issues || [];
    const errorMessages = issues.map(issue => issue.message).join(", ");

    req.session.alert = {
      mode: "swal",
      type: "error",
      title: "Validation Failed",
      message: errorMessages
    };
    return res.redirect(req.get('referer') || '/');
  }

  req.body = result.data;
  next();
};
