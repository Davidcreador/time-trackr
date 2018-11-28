/* Some time constants. */
let MILISECONDS_IN_SECOND = 1000;
let MILISECONDS_IN_MINUTE = 60 * MILISECONDS_IN_SECOND;
let MINUTES_IN_HOUR = 60;
let SECONDS_IN_MINUTE = 60;

String.prototype.pad = function(length, padding) {
  let result = this;
  while (result.length < length) {
    result = padding + result;
  }
  return result;
};

function convertMS(milliseconds) {
  let day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / MILISECONDS_IN_SECOND);
  minute = Math.floor(seconds / MINUTES_IN_HOUR);
  seconds = seconds % SECONDS_IN_MINUTE;
  hour = Math.floor(minute / MINUTES_IN_HOUR);
  minute = minute % SECONDS_IN_MINUTE;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  let obj = {
    day: day,
    hour: hour,
    minute: minute,
    seconds: seconds,
  };
  return obj;
}

/* Formats the time in the H:MM format. */
module.exports = function formatTime(time) {
  let { day, hour, minute, seconds } = convertMS(time);
  return hour + ':' + String(minute).pad(2, '0') + ':' + String(seconds).pad(2, '0');
};
