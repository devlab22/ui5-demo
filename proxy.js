/* eslint-disable no-console */
"use strict";

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8081;

var corsProxy = require("cors-anywhere");
corsProxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["Origin", "*"],
    removeHeaders: ["cookie", "cookie2"]
}).listen(port, host, function() {
    console.log("Running CORS Anywhere on " + host + ":" + port);
});