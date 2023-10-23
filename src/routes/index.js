import Auth from "./auth";
import Blog from "./blog";

function Routes(app, db) {
  this.routes = {
    Auth,
    Blog,
  };

  this.associate = function () {
    const names = Object.keys(this.routes);
    for (let i = 0; i < names.length; i++) {
      this[names[i]] = this.routes[names[i]](app, db);
    }
  };

  this.associate();
}

export default Routes;
