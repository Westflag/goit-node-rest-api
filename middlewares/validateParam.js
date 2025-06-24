import HttpError from "../helpers/HttpError.js";

const isValidUUID = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const validateParam = (req, _, next) => {
  const {id} = req.params;
  const intId = Number(id);

  if (!Number.isInteger(intId) || intId <= 0) {
    return next(HttpError(404, "Invalid ID"));
  }

  next();
};

export default validateParam;
