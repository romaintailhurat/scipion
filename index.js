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
  .action(function(alias, options) {
    runCommand(alias);
  });

program.parse(process.argv);

/* Functions */
function storeCommand(command, alias) {
  if(!isStorePresent()) {
    return;
  }
  let storeJSON = JSON.parse(fs.readFileSync(STORE_PATH));
  storeJSON[alias] = command;
  fs.writeFileSync(STORE_PATH, JSON.stringify(storeJSON));
}

function runCommand(alias) {
  let storeJSON = JSON.parse(fs.readFileSync(STORE_PATH));
  let child = exec(storeJSON[alias], function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

function isStorePresent() {
  try {
    let stats = fs.statSync(STORE_PATH);
    return true;
  } catch(e) {
    console.log(e);
  }
}
