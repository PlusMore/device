/* ---------------------------------------------------- +/

## Helpers ##

Functions that need to be available both on the server and client.

/+ ---------------------------------------------------- */

//

Schema = {};

stripTrailingSlash = function(str) {
  if(str.substr(-1) == '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}