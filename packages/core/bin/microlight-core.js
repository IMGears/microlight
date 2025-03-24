#!/usr/bin/env node

import { Command } from "commander";
import path from "path";

import { packageUp } from "package-up";

import { prepareTasks } from "../dist/scripts/prepareTasks.js";
import { prepareServer } from "../dist/scripts/prepareServer.js";
import { prepareEnvVars } from "../dist/scripts/prepareEnvVars.js";



const program = new Command();

let basePath = await packageUp();
basePath = basePath.split("/");
basePath.pop();
const tasksDir = path.join("/", ...basePath, "src", "tasks");

program
  .name("microlight-core")
  .description("Microlight core utilities")
  .version("1.0.0");

// Define the `prepare` command
const prepareCommand = program
  .command("prepare")
  .description("Prepare the environment");
// .action(() => {
//   console.log("Preparing environment...");
// });

prepareCommand
  .command("all")
  .description("Perform all prepare commands")
  .action(async() => {
    await prepareTasks();
    console.log('\n');
    const { prepareFolders } = await import("../dist/scripts/prepareFolders.js");
    await prepareFolders();
    
    console.log('\n');
    await prepareServer();

    console.log('\n');
    await prepareEnvVars();
  });

prepareCommand
  .command("tasks")
  .description("Index tasks and create an importer")
  .action(async () => {
    await prepareTasks();
  });

prepareCommand
  .command("folders")
  .description("Index folders")
  .action(async () => {
    const { prepareFolders } = await import("../dist/scripts/prepareFolders.js");
    await prepareFolders();
  });


prepareCommand
  .command("server")
  .description("Setup the server")
  .action(async () => {
    prepareServer();
  });

  prepareCommand
  .command("env")
  .description("Setup the env vars")
  .action(async () => {
    prepareEnvVars();
  });

// Parse CLI arguments
program.parse(process.argv);
