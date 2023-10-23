import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      names: { type: DataTypes.STRING(100) },
      lastNames: { type: DataTypes.STRING(100) },
      address: { type: DataTypes.STRING(255) },
      roleId: { type: DataTypes.INTEGER },
    },
    {
      paranoid: true,
      tableName: "Users",
      timestamps: true,
      hooks: {
        beforeCreate: (user) => {
          if (user.password) {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            user.password = hashedPassword;
          }
        },
        beforeUpdate: (user) => {
          if (user.changed("password")) {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            user.password = hashedPassword;
          }
        },
      },
    }
  );
  User.associate = function (models) {
    User.hasMany(models.Blog, { foreignKey: "userId" });
    User.hasMany(models.Comment, { foreignKey: "userId" });
  };

  User.createUser = async function (data) {
    return await this.create(data);
  };

  User.findByUsername = async function (username) {
    return await this.findOne({ where: { username } });
  };

  User.verifyPassword = function (inputPassword, userPassword) {
    return bcrypt.compareSync(inputPassword, userPassword);
  };

  User.prototype.changePassword = async function (newPassword) {
    this.password = newPassword;
    await this.save();
  };

  return User;
};
