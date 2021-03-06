/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var NullDependency = require("./NullDependency");

function AMDDefineDependency(range, arrayRange, functionRange, objectRange) {
	NullDependency.call(this);
	this.Class = AMDDefineDependency;
	this.range = range;
	this.arrayRange = arrayRange;
	this.functionRange = functionRange;
	this.objectRange = objectRange;
}
module.exports = AMDDefineDependency;

AMDDefineDependency.prototype = Object.create(NullDependency.prototype);
AMDDefineDependency.prototype.type = "amd define";

AMDDefineDependency.Template = function AMDRequireDependencyTemplate() {};

AMDDefineDependency.Template.prototype.apply = function(dep, source, outputOptions, requestShortener) {
	var localModuleVar = dep.localModule && dep.localModule.used && dep.localModule.variableName();
	if(localModuleVar) {
		if(dep.objectRange && !dep.functionRange) {
			source.replace(dep.range[0], dep.objectRange[0]-1,
				"!(" + localModuleVar + " = ");
			source.insert(0, "var " + localModuleVar + ";");
			source.replace(dep.objectRange[1], dep.range[1]-1, ")");
		} else if(!dep.arrayRange && dep.functionRange && !dep.objectRange) {
			source.replace(dep.range[0], dep.functionRange[0]-1,
				"!(" + localModuleVar + " = (");
			source.insert(0, "var " + localModuleVar + ";");
			source.replace(dep.functionRange[1], dep.range[1]-1, ".call(exports, require, exports, module)))");
		} else if(dep.arrayRange && dep.functionRange && !dep.objectRange) {
			source.replace(dep.range[0], dep.arrayRange[0]-1,
				"!(" + localModuleVar + " = ");
			source.insert(0, "var __WEBPACK_AMD_DEFINE_ARRAY__, " + localModuleVar + ";");
			source.replace(dep.arrayRange[1], dep.functionRange[0]-1, ", __WEBPACK_AMD_DEFINE_RESULT__ = (");
			source.replace(dep.functionRange[1], dep.range[1]-1, ".apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)))");
		} else if(dep.functionRange && dep.objectRange) {
			source.replace(dep.range[0], dep.functionRange[0]-1,
				"!(__WEBPACK_AMD_DEFINE_FACTORY__ = (");
			source.insert(0, "var __WEBPACK_AMD_DEFINE_FACTORY__, " + localModuleVar + ";");
			source.replace(dep.functionRange[1], dep.range[1]-1, "), (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (" + localModuleVar + " = __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, require, exports, module)) : " + localModuleVar + " = __WEBPACK_AMD_DEFINE_FACTORY__))");
		}
	} else {
		if(dep.objectRange && !dep.functionRange) {
			source.replace(dep.range[0], dep.objectRange[0]-1,
				"!(module.exports = ");
			source.replace(dep.objectRange[1], dep.range[1]-1, ")");
		} else if(!dep.arrayRange && dep.functionRange && !dep.objectRange) {
			source.replace(dep.range[0], dep.functionRange[0]-1,
				"!(__WEBPACK_AMD_DEFINE_RESULT__ = (");
			source.insert(0, "var __WEBPACK_AMD_DEFINE_RESULT__;");
			source.replace(dep.functionRange[1], dep.range[1]-1, ".call(exports, require, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))");
		} else if(dep.arrayRange && dep.functionRange && !dep.objectRange) {
			source.replace(dep.range[0], dep.arrayRange[0]-1,
				"!(__WEBPACK_AMD_DEFINE_ARRAY__ = ");
			source.insert(0, "var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;");
			source.replace(dep.arrayRange[1], dep.functionRange[0]-1, ", __WEBPACK_AMD_DEFINE_RESULT__ = (");
			source.replace(dep.functionRange[1], dep.range[1]-1, ".apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))");
		} else if(dep.functionRange && dep.objectRange) {
			source.replace(dep.range[0], dep.functionRange[0]-1,
				"!(__WEBPACK_AMD_DEFINE_FACTORY__ = (");
			source.insert(0, "var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;");
			source.replace(dep.functionRange[1], dep.range[1]-1, "), (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_RESULT__ = __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, require, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : module.exports = __WEBPACK_AMD_DEFINE_FACTORY__))");
		}
	}
};
