import Auth from "./auth";

function Routes(app, db, services) {
  this.routes = {
    Auth,
  };

  this.associate = function () {
    const names = Object.keys(this.routes);
    for (let i = 0; i < names.length; i++) {
      this[names[i]] = this.routes[names[i]](app, db, services);
    }
  };

  this.associate();
}

export default Routes;
