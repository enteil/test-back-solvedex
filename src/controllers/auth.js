export default function (app, db) {
  const { User, Session } = db;
  return {
    checkEmail: async function (req, res) {
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
      const user = await User.createUser(data);
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

    updatePassword: async function (req, res) {
      const {
        user,
        body: { data },
      } = req;
      await user.update({ password: data.newPassword });
      return {};
    },
  };
}
