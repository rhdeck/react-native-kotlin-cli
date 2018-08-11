#!/usr/bin/env node
let program = require("commander");
const yarnif = require("yarnif");
const makeNewProject = require("../lib/makeNewProject");
const copyAndReplace = require("../lib/copyAndReplace");
const fs = require("fs");
const spawnSync = require("child_process").spawnSync;
const chdir = require("process").chdir;
const cwd = require("process").cwd;
const opts = {
  encoding: "utf8",
  stdio: "inherit"
};
function validateModuleName(name) {
  if (!name.match(/^[$A-Z_][0-9A-Z\-_$]*$/i)) {
    console.error(
      '"%s" is not a valid name for a module. Please use a valid identifier ' +
        "name (alphanumeric with dashes).",
      name
    );
    process.exit(1);
  }
}
function validateAppName(name) {
  if (!name.match(/^[$A-Z_][0-9A-Z\_$]*$/i)) {
    console.error(
      '"%s" is not a valid name for a react-native app. Please use a valid identifier ' +
        "name (alphanumeric).",
      name
    );
    process.exit(1);
  }
}
program
  .command("init <projectname> [projectpath]")
  .alias("i")
  .description("Initialize a new kotlin-based native module project")
  .action(function(projectname, projectpath) {
    validateModuleName(projectname);
    if (!projectpath) projectpath = "./" + projectname;
    makeNewProject(projectname, projectpath);
    chdir(projectpath);
    yarnif.addDevDependency("react-native-kotlin-bridge");
    spawnSync("yarn", ["run", "react-native-kotlin-bridge"], opts);
    spawnSync("yarn", ["link"], opts);
  });

program
  .command("makeapp <appprojectname> <pathToKotlinProject> [appprojectpath]")
  .alias("m")
  .description(
    "Create a blank app that adds a kotlin module to make development easier"
  )
  .action(function(appname, kotlinpath, appprojectpath) {
    validateAppName(appname);
    if (!appprojectpath) appprojectpath = "./" + appname;
    if (["/", "."].indexOf(kotlinpath.substring(0, 1)) == -1)
      kotlinpath = "./" + kotlinpath;
    if (kotlinpath.substring(0, 1) != "/")
      kotlinpath = cwd() + "/" + kotlinpath;
    if (!fs.existsSync(kotlinpath + "/package.json")) {
      console.log(
        "There is no valid project at the path: " + kotlinpath + "\n"
      );
      return;
    }
    const kotlinjson = require(kotlinpath + "/package.json");
    const kotlinprojectname = kotlinjson.name;

    spawnSync("react-native", ["init", appname, appprojectpath], opts);
    chdir(appprojectpath);
    spawnSync("yarn", ["add", "react-native-kotlin"], opts);
    spawnSync("yarn", ["link", kotlinprojectname], opts);
    spawnSync("yarn", ["add", kotlinpath], opts);
    spawnSync(
      "yarn",
      [
        "add",
        "react-native-update-gradle",
        "react-native-android-studio",
        "react-native-bundlebase"
      ],
      opts
    );
    spawnSync("react-native", ["link"], opts);
    copyAndReplace(__dirname + "/../templates/App.js", "./App.js", {
      rnkotlintemplate: kotlinprojectname
    });
    console.log(
      'Done. To edit your project in Android Studio, type "react-native studio"'
    );
  });
program
  .command("*")
  .description("All malformed commands display this help")
  .action(function() {
    program.outputHelp();
  });
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
