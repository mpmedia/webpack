#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
// Local version replace global one
try {
	var localWebpack = require.resolve(path.join(process.cwd(), "node_modules", "webpack", "bin", "webpack.js"));
	if(__filename != localWebpack) {
		return require(localWebpack);
	}
} catch(e) {}
var fs = require("fs");
var util = require("util");
var optimist = require("optimist")
	.usage("webpack " + require("../package.json").version + "\n" +
		"Usage: http://webpack.github.io/docs/webpack-detailed-usage.html")
	
require("./config-optimist")(optimist);

optimist

	.boolean("json").alias("json", "j").describe("json")
	
	.boolean("colors").alias("colors", "c").describe("colors")

	.string("sort-modules-by").describe("sort-modules-by")

	.string("sort-chunks-by").describe("sort-chunks-by")

	.string("sort-assets-by").describe("sort-assets-by")

	.boolean("display-chunks").describe("display-chunks")

	.boolean("display-error-details").describe("display-error-details")

	.boolean("display-origins").describe("display-origins")

	.boolean("display-reasons").alias("display-reasons", "verbose").alias("display-reasons", "v").describe("display-reasons");

	
var argv = optimist.argv;

var options = require("./convert-argv")(optimist, argv);

function ifArg(name, fn, init) {
	if(Array.isArray(argv[name])) {
		if(init) init();
		argv[name].forEach(fn);
	} else if(typeof argv[name] != "undefined") {
		if(init) init();
		fn(argv[name], -1);
	}
}



var outputOptions = {
	cached: false,
	context: options.context
};

ifArg("json", function(bool) {
	outputOptions.json = bool;
});

ifArg("colors", function(bool) {
	outputOptions.colors = bool;
});

ifArg("sort-modules-by", function(value) {
	outputOptions.modulesSort = value;
});

ifArg("sort-chunks-by", function(value) {
	outputOptions.chunksSort = value;
});

ifArg("sort-assets-by", function(value) {
	outputOptions.assetsSort = value;
});

if(!outputOptions.json) {
	ifArg("display-chunks", function(bool) {
		outputOptions.modules = !bool ;
		outputOptions.chunks = bool;
	});

	ifArg("display-reasons", function(bool) {
		outputOptions.reasons = bool;
	});

	ifArg("display-error-details", function(bool) {
		outputOptions.errorDetails = bool;
	});

	ifArg("display-origins", function(bool) {
		outputOptions.chunkOrigins = bool;
	});
} else {
	outputOptions.chunks = true;
	outputOptions.modules = true;
	outputOptions.chunkModules = true;
	outputOptions.reasons = true;
}

var webpack = require("../lib/webpack.js");

Error.stackTrackLimit = 30;
webpack(options, function(err, stats) {
	if(err) {
		console.error(err.stack || err);
		return;
	}
	if(outputOptions.json)
		process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
	else {
		process.stdout.write(stats.toString(outputOptions) + "\n");
	}
	if(!options.watch) {
		// Do not keep cache anymore
		var ifs = stats.compilation.compiler.inputFileSystem;
		if(ifs && ifs.purge) ifs.purge();
	}
});