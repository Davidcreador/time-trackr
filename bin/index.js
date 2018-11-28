#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const inquirer = require('inquirer');
const figlet = require('figlet');
const shell = require('shelljs');
const fs = require('fs');
const config = require('../config');
const Project = require('../lib');
const formatTime = require('../utils/formatTime');

// Clear the terminal first and then show the logo
clear();
console.log(chalk.cyan(figlet.textSync('TIMR', { horizontalLayout: 'fitted' })));

// Create new project to track
let project = new Project();

function initializeTimer() {
  process.stdin.resume();
}

if (config.stdin && config.time) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', data => {
    const str = data
      .toString()
      .trim()
      .toLowerCase();

    if (str === config.time) {
      project.getTimeSpent();
    } else if (data.charCodeAt(0) === 12) {
      console.clear();
    } else if (config.stdin) {
      if (str === config.stop) {
        // stop timer
        project.stop();
        project.createReport();
      }
    }
  });
}

const initQuestions = [
  {
    type: 'list',
    name: 'action',
    message: 'Select an option',
    choices: ['Track', 'Timespent'],
    default: 'Track',
  },
];

const projectQuestions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project Name',
    validate: input => {
      return new Promise((resolve, reject) => {
        if (!input.length) reject('Please provide a project name to track!');
        resolve(true);
      });
    },
  },
  {
    type: 'input',
    name: 'projectTicket',
    message: 'Project Ticket',
    validate: input => {
      return new Promise((resolve, reject) => {
        if (!input.length) reject('Please provide a project ticket to track!');
        resolve(true);
      });
    },
  },
  {
    type: 'input',
    name: 'outputExport',
    message: 'Export output directory',
    default: `${process.cwd()}/timr/`,
  },
];

(async function() {
  this.export = exportJson;
  this.track = track;
  this.timespent = timespent;
  let questions = await inquirer.prompt(initQuestions);

  await this[questions.action.toLowerCase()]();

  async function track() {
    let now = new Date();
    let originalValue = String(now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear()).pad(2, '0');
    const { projectName, projectTicket, outputExport } = await inquirer.prompt(projectQuestions);
    project.setName(projectName);
    project.setDate(originalValue);
    project.setTicket(projectTicket);

    // start timer
    project.start(projectName);
    initializeTimer();
  }
  async function timespent() {
    project.createReport();
  }
  async function exportJson() {}
})();
