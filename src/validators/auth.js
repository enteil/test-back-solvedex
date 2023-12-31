import { check } from "express-validator";
import _response from "../helpers/response";
import validOrAbort from "../middlewares/validate";
import checkAuthMD from "../middlewares/check-auth";
import checkEmailMD from "../middlewares/user/check-email";
export default function (app, db) {
  const { User } = db;
  const checkAuth = checkAuthMD(app, db);
  const checkEmail = checkEmailMD(app, db);
  return {
    checkEmail: [
      check("data.email")
        .notEmpty()
        .withMessage("data.email.required")
        .isEmail()
        .withMessage("data.email.bad"),
      validOrAbort,
      checkEmail,
    ],

    login: [
      check("data.email")
        .notEmpty()
        .withMessage("data.email.required")
        .isEmail()
        .withMessage("data.email.bad"),

      check("data.password")
        .notEmpty()
        .withMessage("data.password.required")
        .isLength({ min: 6 })
        .withMessage("data.password.minimumLength"),

      validOrAbort,
      checkEmail,
      async (req, res, next) => {
        const {
          user,
          body: {
            data: { password },
          },
        } = req;
        const match = await User.verifyPassword(password, user.password);
        if (!match) {
          return _response(req, res)(null, {
            code: "data.password.mismatch",
            status: 400,
          });
        }
        next();
      },
    ],
    logout: [checkAuth],
    register: [
      check("data.email")
        .notEmpty()
        .withMessage("data.email.required")
        .isEmail()
        .withMessage("data.email.bad"),
      check("data.password")
        .notEmpty()
        .withMessage("data.password.required")
        .isLength({ min: 6 })
        .withMessage("data.password.minimumLength"),
      check("data.names")
        .notEmpty()
        .withMessage("data.names.required")
        .isLength({ min: 6 })
        .withMessage("data.names.minimumLength"),
      check("data.lastNames")
        .notEmpty()
        .withMessage("data.lastNames.required")
        .isLength({ min: 6 })
        .withMessage("data.lastNames.minimumLength"),
      validOrAbort,
      async (req, res, next) => {
        const { email } = req.body.data;
        try {
          const user = await User.findOne({ where: { email } });
          if (user) {
            return _response(req, res)(null, {
              code: "email.already.saved",
              status: 401,
            });
          }
          next();
        } catch (error) {
          console.error(Date.now(), error);
          return _response(req, res)(null, {
            err: error,
            code: "server.error",
            status: 500,
          });
        }
      },
    ],
  };
}
