import generateRandomString from "../helpers/crypto";
import bcrypt from "bcrypt";
import moment from "moment";
export default (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      ip: { type: DataTypes.STRING(100), allowNull: true },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      active: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 1 },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "Sessions",
      hooks: {
        beforeCreate: (session) => {
          const randomString = generateRandomString();
          const encryptString = bcrypt.hashSync(randomString, 10);
          session.token = Buffer.from(encryptString).toString("base64");

          session.lastAt = moment().format("YYYY-MM-DD HH:mm:ss");
        },
      },
    }
  );

  Session.findByToken = async function (token) {
    return await this.findOne({ where: { token } });
  };

  Session.createSession = async function (data) {
    return await this.create(data);
  };

  Session.prototype.updateLastActivity = async function () {
    this.lastAt = new Date();
    await this.save();
  };

  Session.associate = function (models) {
    Session.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Session;
};
