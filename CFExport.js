const AWS = require("aws-sdk");

class CFExport {
  constructor(env, region = "us-east-1") {
    this.setEnv(env);
    this.setCF(region);
  }

  setEnv(env) {
    this.env = env;
  }

  setCF(region) {
    this.cf = new AWS.CloudFormation({ region });
  }

  async import(options) {
    options = options || { prefix: "", suffix: "" };
    const res = await this.cf.listExports().promise();
    const exportsValues = res.Exports;
    const compiled = {};
    const envMap = exportsValues.reduce((obj, exportValue) => {
      obj[exportValue.Name] = exportValue.Value;

      return obj;
    }, {});

    for (const key in this.env) {
      if (Object.hasOwnProperty.call(this.env, key)) {
        const value = this.env[key];
        const valueKey = options.prefix + value + options.suffix;
        compiled[key] = envMap[valueKey] ? envMap[valueKey] : "KEY_NOT_FOUND";
      }
    }

    return compiled;
  }
}

module.exports = CFExport;
