/* ---------------------------------------------------- +/

## Helpers ##

Functions that need to be available both on the server and client.

/+ ---------------------------------------------------- */

stripTrailingSlash = function(str) {
  if (str.substr(-1) == '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

isBetweenTimes = function(zone, time, startMinutes, endMinutes) {
  if (startMinutes && endMinutes) {
    console.log('zone: ', zone);
    var start = moment().zone(zone).startOf('day').minutes(startMinutes);
    var end = moment().zone(zone).startOf('day').minutes(endMinutes);
    var now = moment(time).zone(zone);

    console.log('now: ', now.toString());
    console.log('start: ', start.toString());
    console.log('end: ', end.toString());

    return !!(now.isAfter(start) && now.isBefore(end));
  }
  return true;
};
