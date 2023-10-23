import { validationResult } from "express-validator";
import _response from "../helpers/response.js";
export default function (req, res, next) {
  const errorValidation = validationResult(req);
  if (!errorValidation.isEmpty()) {
    const response = {};
    const arr = errorValidation.array();
    const keyFirstError = arr[0].msg;
    for (let i = 0; i < arr.length; i++) {
      if (!response[arr[i].param]) {
        response[arr[i].param] = [];
      }
      response[arr[i].param].push(arr[i].msg);
    }
    return _response(req, res)(null, { status: 400, code: keyFirstError });
  }
  next();
}
