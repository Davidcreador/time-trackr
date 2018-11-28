const chalk = require('chalk');
const formatTime = require('../utils/formatTime');
const report = require('../utils/createReport');

function Project() {
  this._name = null;
  this._ticket = null;
  this._date = null;
  this._state = Project.State.STOPPED;
  this._timeSpentInPreviousIterations = 0;
  this._currentIterationStartTime = 0;
  this._onChange = null;
}

Project.State = {
  STOPPED: 'stopped',
  RUNNING: 'running',
};

Project.prototype = {
  _callOnChange: function() {
    return this.getTimeSpent();
  },

  _getCurrentIterationTime: function() {
    return new Date().getTime() - this._currentIterationStartTime;
  },

  getName: function() {
    return this._name;
  },

  getTicket: function() {
    return this._ticket;
  },

  setName: function(name) {
    this._name = name;
  },

  setTicket: function(ticket) {
    this._ticket = ticket;
  },

  setDate: function(date) {
    this._date = date;
  },

  getTimeSpent: function() {
    let result = this._timeSpentInPreviousIterations;
    if (this._state == Project.State.RUNNING) {
      result += this._getCurrentIterationTime();
    }
    console.log(chalk.cyan(`Time Spent: ${chalk.green(formatTime(result))}`));
    return result;
  },

  isRunning: function() {
    return this._state == Project.State.RUNNING;
  },

  start: function() {
    console.log('started...');
    if (this._state == Project.State.RUNNING) {
      return;
    }
    this._state = Project.State.RUNNING;
    this._currentIterationStartTime = new Date().getTime();
    this._callOnChange();
  },

  stop: function() {
    if (this._state == Project.State.STOPPED) {
      return;
    }

    this._state = Project.State.STOPPED;
    this._timeSpentInPreviousIterations += this._getCurrentIterationTime();
    this._currentIterationStartTime = 0;
    this._callOnChange();
  },

  reset: function() {
    this.stop();
    this._timeSpentInPreviousIterations = 0;
    this._callOnChange();
  },

  createReport() {
    let reportObj = {
      name: this.getName(),
      ticket: this.getTicket(),
      timeSpent: formatTime(this.getTimeSpent()),
    };
    report.createJsonReport(reportObj);
  },
};

module.exports = Project;
