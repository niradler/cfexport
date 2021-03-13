const path = require("path");
const dotenv = require("dotenv");

const normalizePath = (p) => {
  if (p.startsWith(".")) {
    return path.join(process.cwd(), p);
  }

  return p;
};

const readEnv = (pathToFile) => {
  const env = dotenv.config({ path: pathToFile }).parsed;
  return env;
};

const readJson = (pathToFile) => {
  return require(pathToFile);
};

const toJson = (obj) => {
  return JSON.stringify(obj);
};

const toEnv = (obj) => {
  const keys = Object.keys(obj);
  return keys.map((key) => `${key}=${obj[key]}`).join("\n");
};

module.exports = { normalizePath, readEnv, readJson, toJson, toEnv };
