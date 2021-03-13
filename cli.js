#!/usr/bin/env node
const yargs = require("yargs/yargs");
const fs = require("fs");
const { hideBin } = require("yargs/helpers");
const CFExport = require("./CFExport");
const helpers = require("./helpers");

yargs(hideBin(process.argv))
  .command(
    "compile",
    "compile env file",
    (yargs) => {
      yargs.positional("prefix", {
        describe: "key prefix",
        default: "",
      });
      yargs.positional("suffix", {
        describe: "key suffix",
        default: "",
      });
      yargs.positional("file", {
        describe: "env file path",
        default: "./.env.template",
      });
      yargs.positional("region", {
        describe: "aws cf region",
        default: "us-east-1",
      });
      yargs.positional("output", {
        describe: "output file",
        default: "./.env",
      });
      yargs.positional("format", {
        describe: "output format, json/.env",
        default: ".env",
        choices: [".env", "json"],
      });
    },
    async (argv) => {
      try {
        if (argv.verbose) console.debug(argv);

        const importParams = {
          suffix: argv.suffix,
          prefix: argv.prefix,
        };

        if (argv.format === "json") {
          const env = helpers.readJson(helpers.normalizePath(argv.file));
          const cfExport = new CFExport(env);
          const compileEnv = await cfExport.import(importParams);
          fs.writeFileSync(
            helpers.normalizePath(argv.output),
            helpers.toJson(compileEnv)
          );
        } else if (argv.format === ".env") {
          const env = helpers.readEnv(helpers.normalizePath(argv.file));
          const cfExport = new CFExport(env);
          const compileEnv = await cfExport.import(importParams);
          fs.writeFileSync(
            helpers.normalizePath(argv.output),
            helpers.toEnv(compileEnv)
          );
        }
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .usage("Usage: cfexport <command> [options]")
  .example(
    "cfexport --file ./.env.template region us-east-1 output ./.env format .env"
  )
  .help("h")
  .alias("h", "help").argv;
