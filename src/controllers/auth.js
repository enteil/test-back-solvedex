export default function (app, db, services) {
  const { User, Session } = db;
  return {
    login: async function (req) {
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const { user } = req;
      const newSession = await Session.createSession({
        ip: ipAddress,
        userId: user.id,
      });

      console.log("🚀 ~ file: auth.js:15 ~ permissons:", permissons);
      return {
        token: newSession.token,
        user: {
          id: user.id,
          name: user.name,
        },
        permissons,
      };
    },

    register: async function (req) {
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const { data } = req.body;
      const user = await User.createUser(data);
      const publicData = {
        id: user.id,
        name: user.name,
      };
      const newSession = await Session.createSession({
        ip: ipAddress,
        userId: user.id,
      });
      return {
        token: newSession.token,
        user: publicData,
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

    updateUser: async function (req, res) {
      const {
        user,
        body: { data },
      } = req;

      const dataToUpdate = {
        cellphone: data.cellphone || user.cellphone,
        gender: data.gender || user.gender,
        age: data.age || user.age,
        time: data.time || user.time,
      };

      await user.update(dataToUpdate);
      return {};
    },
  };
}
