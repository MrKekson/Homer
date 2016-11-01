/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var srv = __webpack_require__(1);
	var Core = (function () {
	    function Core() {
	        console.log(" ------ Core Init------ ");
	        console.log("dir: '" + __dirname + "'");
	        this.Server = new srv.WebServer();
	        this.Server.run();
	    }
	    ;
	    return Core;
	}());
	;
	var core = new Core();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var express = __webpack_require__(2);
	var WebServer = (function () {
	    function WebServer(port) {
	        /**
	         * @param port - port to listen on
	         */
	        this._server = express();
	        this.port = 8008;
	        port ? this.port = port : null;
	        // _DEBUG ? console.log("DEBUG") : console.log("NOT DEBUG");
	    }
	    WebServer.prototype.addController = function (name, funct) {
	    };
	    WebServer.prototype.run = function () {
	        console.log("Starting Express server ....");
	        var dir = __dirname + "\\client";
	        var dir2 = express.static(dir);
	        this._server.use(dir2);
	        console.log(dir2);
	        this._server.get('/t', function (req, res) {
	            res.status(200).send('{ "megy": "true" }');
	        });
	        this._server.get('/tt', function (req, res) {
	            res.status(200).send(dir2);
	        });
	        this._server.listen(this.port);
	        console.log("   listening on " + this.port);
	    };
	    return WebServer;
	}());
	exports.WebServer = WebServer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ }
/******/ ]);