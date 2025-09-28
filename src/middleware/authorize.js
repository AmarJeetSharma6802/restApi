// authorize.js
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // req.user auth middleware se aayega

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have access"
      });
    }
    next();
  };
}
