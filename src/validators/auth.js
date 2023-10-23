import { check } from "express-validator";
import validOrAbort from "../middlewares/validate";
import checkAuthMD from "../middlewares/check-auth";
import _response from "../helpers/response";
export default function (app, db, services, response) {
  const { User } = db;
  const checkAuth = checkAuthMD(app, db, services);

  return {
    checkUsername: [
      check("data.docNumber")
        .notEmpty()
        .withMessage("data.docNumber.required")
        .isLength({ max: 50 })
        .withMessage("data.docNumber.exceedsLength"),

      validOrAbort,
      async (req, res, next) => {
        const { docNumber } = req.body.data;
        const user = await User.findByDocNumber(docNumber);
        if (!user) {
          return _response(req, res)(null, {
            code: "data.username.notFound",
            status: 404,
          });
        }
        next();
      },
    ],
    createUser: [
      check("data.email")
        .notEmpty()
        .withMessage("data.email.required")
        .isEmail()
        .withMessage("data.email.invalid")
        .isLength({ max: 50 })
        .withMessage("data.email.exceedsLength"),

      check("data.password")
        .notEmpty()
        .withMessage("data.password.required")
        .isLength({ min: 8 })
        .withMessage("data.password.minimumLength"),

      check("data.role")
        .optional()
        .isIn(["Admin", "Teacher", "Student", "Parent"])
        .withMessage("data.role.invalid"),

      check("data.docNumber")
        .notEmpty()
        .withMessage("data.docNumber.required")
        .isLength({ max: 50 })
        .withMessage("data.docNumber.exceedsLength"),

      check("data.names")
        .optional()
        .isLength({ max: 100 })
        .withMessage("data.names.exceedsLength"),

      check("data.lastNames")
        .optional()
        .isLength({ max: 100 })
        .withMessage("data.lastNames.exceedsLength"),

      check("data.phone")
        .optional()
        .isLength({ max: 15 })
        .withMessage("data.phone.exceedsLength"),

      check("data.address")
        .optional()
        .isLength({ max: 255 })
        .withMessage("data.address.exceedsLength"),

      check("data.dateOfBirth")
        .optional()
        .isDate()
        .withMessage("data.dateOfBirth.invalid"),

      check("data.institutionId")
        .optional()
        .isInt()
        .withMessage("data.institutionId.invalid"),

      validOrAbort,
    ],
    updateUser: [
      check("data.email")
        .optional()
        .isEmail()
        .withMessage("data.email.invalid")
        .isLength({ max: 50 })
        .withMessage("data.email.exceedsLength"),

      check("data.password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("data.password.minimumLength"),

      check("data.role")
        .optional()
        .isIn(["Admin", "Teacher", "Student", "Parent"])
        .withMessage("data.role.invalid"),

      check("data.docNumber")
        .optional()
        .isLength({ max: 50 })
        .withMessage("data.docNumber.exceedsLength"),

      check("data.names")
        .optional()
        .isLength({ max: 100 })
        .withMessage("data.names.exceedsLength"),

      check("data.lastNames")
        .optional()
        .isLength({ max: 100 })
        .withMessage("data.lastNames.exceedsLength"),

      check("data.phone")
        .optional()
        .isLength({ max: 15 })
        .withMessage("data.phone.exceedsLength"),

      check("data.address")
        .optional()
        .isLength({ max: 255 })
        .withMessage("data.address.exceedsLength"),

      check("data.dateOfBirth")
        .optional()
        .isDate()
        .withMessage("data.dateOfBirth.invalid"),

      check("data.institutionId")
        .optional()
        .isInt()
        .withMessage("data.institutionId.invalid"),
      validOrAbort,
    ],
    login: [
      check("data.docNumber")
        .notEmpty()
        .withMessage("data.docNumber.required")
        .isLength({ max: 50 })
        .withMessage("data.docNumber.exceedsLength"),

      check("data.password")
        .notEmpty()
        .withMessage("data.password.required")
        .isLength({ min: 6 })
        .withMessage("data.password.minimumLength"),

      validOrAbort,
      async (req, res, next) => {
        const { docNumber } = req.body.data;
        const user = await User.findByDocNumber(docNumber);
        if (!user) {
          return _response(req, res)(null, {
            code: "data.username.notFound",
            status: 404,
          });
        }
        req.user = user;
        next();
      },
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
  };
}
