import { translations } from "../config/langs.js";

export default function createResponseHandler(req, res, next = null) {
  return function handleResponse(response, error = null) {
    const lang = req.headers.lang || "es";
    let statusCode = 200;

    if (error) {
      console.log("🚀 ~ file: response.js:5 ~ handleResponse ~ error:", error);
      statusCode = error.status;
      const errorMessage =
        translations[error.code || "server.error"][lang] ||
        error.code ||
        "server.error";
      if (error.err) {
        console.log(error.err);
      }

      return res.status(statusCode).json({
        date: Date.now(),
        statusCode,
        message: errorMessage,
      });
    }

    const successMessage = translations["server.ok"][lang];

    return res.status(statusCode).json({
      statusCode,
      message: successMessage,
      data: response,
      _channel: "web",
    });
  };
}
