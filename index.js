'use strict';
const program = require('commander');
const fs = require('fs');
const exec = require('child_process').exec;

const STORE_PATH = 'store.json';

/* CLI */
program.version('0.1.0');

program
  .command('register <command>')
  .description('Register a file or a command in the script repo')
  .option('-a, --alias <name>', 'An alias for the script')
  .option('-t, --tags [list of tags]', 'Tags attached to the script')
  .action(function(command, options) {
    let alias = options.alias;
    storeCommand(command, alias);
  });

program
  .command('run <alias>')
  .action(function(alias) {
    runCommand(alias);
  });

program
  .command('list')
  .description('List all stored commands')
  .action(function() {
    listCommands();
  });

program
  .command('show <alias>')
  .description('Show the command line relative to an alias')
  .action((alias) => {
    showCommand(alias);
  });

program.parse(process.argv);

/* Functions */
function storeCommand(command, alias) {
  if(!isStorePresent()) {
    return;
  }
  let storeJSON = getStore();
  storeJSON[alias] = command;
  fs.writeFileSync(STORE_PATH, JSON.stringify(storeJSON));
}

function runCommand(alias) {
  let storeJSON = getStore();
  let child = exec(storeJSON[alias], function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

function listCommands() {
  let storeJSON = getStore();
  Object.keys(storeJSON).forEach((key) => console.log(key, '==>', storeJSON[key]));
}

function showCommand(alias) {
  console.log(getStore()[alias]);
}

/* Utils */
function isStorePresent() {
  try {
    let stats = fs.statSync(STORE_PATH);
    return true;
  } catch(e) {
    console.log(e);
  }
}

function getStore() {
  return JSON.parse(fs.readFileSync(STORE_PATH));
}
