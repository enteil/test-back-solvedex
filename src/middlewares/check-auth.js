import _response from "../helpers/response";
export default function (app, db, response) {
  const { User, Session } = db;
  return async function (req, res, next) {
    try {
      const headerToken = req.headers.authorization;
      if (!headerToken || !headerToken.split(" ")[1]) {
        return _response(req, res)(null, {
          code: "auth.no.token",
          status: 401,
        });
      }
      const splitToken = headerToken.split(" ")[1];
      const session = await Session.findOne({
        attributes: ["id", "lastAt", "ip", "createdAt"],
        where: {
          token: splitToken,
          active: true,
        },
        include: [
          {
            model: User,
            required: true,
          },
        ],
        raw: false,
      });

      if (!session) {
        return _response(req, res)(null, {
          code: "auth.no.token",
          status: 401,
        });
      }
      const user = session.User;
      if (!user) {
        return _response(req, res)(null, {
          code: "user.blocked",
          status: 401,
        });
      }
      req.user = user;
      req.session = session;
      await session.update({ lastAt: Date.now() });
      next();
    } catch (err) {
      console.error("AUTH FAILED", Date.now(), err);
      return _response(req, res)(null, {
        err,
        code: "server.error",
        status: 500,
      });
    }
  };
}
