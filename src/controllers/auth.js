export default function (app, db) {
  const { User, Session } = db;
  return {
    checkEmail: async function () {
      return {};
    },
    login: async function (req) {
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const { user } = req;
      console.log("🚀 ~ file: auth.js:8 ~ user:", user);
      const newSession = await Session.createSession({
        ip: ipAddress,
        userId: user.id,
      });

      return {
        token: newSession.token,
        user: {
          id: user.id,
          names: user.names,
          lastNames: user.lastNames,
        },
      };
    },
    register: async function (req) {
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const { data } = req.body;
      const newUserData = {
        email: data.email,
        password: data.password,
        names: data.names,
        lastNames: data.lastNames,
      };
      const user = await User.createUser(newUserData);
      const newSession = await Session.createSession({
        ip: ipAddress,
        userId: user.id,
      });
      return {
        token: newSession.token,
        user: {
          id: user.id,
          names: user.names,
          lastNames: user.lastNames,
        },
      };
    },
    logout: async function (req) {
      const { session } = req;
      await session.update({ active: 0 });
      return {};
    },
  };
}
