import _response from "../helpers/response.js";
export default (controller) => {
  return async (req, res, next) => {
    const { body } = req;
    const requestTime = Date.now();
    let toSave = {
      url: req.originalUrl,
      request: body,
      response: null,
      responseTime: null,
    };
    let response = null;
    try {
      response = await controller(req, res, next);
    } catch (err) {
      return _response(req, res)(null, {
        err,
        status: 500,
        code: "server.error",
      });
    }
    toSave.responseTime = `${Date.now() - requestTime} ms`;
    toSave.response = response;
    console.log("🚀 ~ file: try-catch.js ~ return ~ toSave:", toSave);
    return _response(req, res)(response);
  };
};
