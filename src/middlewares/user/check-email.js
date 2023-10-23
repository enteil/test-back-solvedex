import _response from "../../helpers/response";

export default function (app, db) {
  const { User } = db;

  return async (req, res, next) => {
    const { email } = req.body.data;
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return _response(req, res)(null, {
          code: "user.notFound",
          status: 400,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("AUTH FAILED", Date.now(), error);
      return _response(req, res)(null, {
        err: error,
        code: "server.error",
        status: 500,
      });
    }
  };
}
