import HttpError from "./HttpError.js";

const isValidUUID = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const validateParam = (req, _, next) => {
  const { id } = req.params;
  if (!isValidUUID(id)) {
    return next(HttpError(404));
  }
  next();
};

export default validateParam;
