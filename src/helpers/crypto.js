const crypto = require("crypto");
const length = 30;
export default function generateRandomString() {
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  return bytes.toString("hex").slice(0, length);
}
