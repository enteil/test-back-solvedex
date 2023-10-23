import Sequelize from "sequelize";
import User from "../models/user.js";
import Session from "../models/session.js";

class Models {
  constructor() {
    this.sequelize = null;
    this.models = {
      Session,
      User,
    };
    this.Sequelize = Sequelize;
    this.Op = Sequelize.Op;

    this.connect();
    this.associate();
  }

  databaseConfig() {
    return {
      database: process.env.DB_NAME,
      username: process.env.DB_WRITER_USERNAME,
      password: process.env.DB_WRITER_PASSWORD,
      port: process.env.DB_PORT || 3306,
      host: process.env.DB_HOST || "localhost",
      dialect: process.env.DB_DIALECT || "mysql",
      timezone: "-05:00",
      logging: false,
    };
  }

  connect() {
    const config = this.databaseConfig();
    this.sequelize = new Sequelize(config);

    this.sequelize
      .authenticate()
      .then(() => {
        console.log(
          " Connection to the database has been established successfully."
        );
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }

  associate() {
    const modelNames = Object.keys(this.models);
    for (const name of modelNames) {
      const modelData = this.models[name];
      const model = modelData(this.sequelize, this.Sequelize.DataTypes);
      this[model.name] = model;
    }

    for (const name of modelNames) {
      if (this[name].associate) {
        this[name].associate(this);
      }
    }
  }
}

export default Models;
