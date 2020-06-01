module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(707);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 494:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 673:
/***/ (function(module) {

module.exports = `query($repo: String!, $owner: String!, $branch: String!) {
  repository(name: $repo, owner: $owner) {
    ref(qualifiedName: $branch) {
      target {
        ... on Commit {
          deployments(last: 1) {
            edges {
              node {
                latestStatus {
                  environmentUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
`

/***/ }),

/***/ 707:
/***/ (function(__unusedmodule, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(494);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(948);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _query_gql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(673);
/* harmony import */ var _query_gql__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_query_gql__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(813);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_es__WEBPACK_IMPORTED_MODULE_3__);





async function getDeployment(args, retryInterval) {
  const interval = retryInterval || 10000;
  let environment = null;
  while (!environment) {
    environment = await tryGetResult(args);
    if (!environment)
      console.log(
        `environment is null, waiting ${interval} milliseconds and trying again`
      );
    await new Promise((resolve) => setTimeout(resolve, interval || 10000));
  }
  return environment;
}

async function tryGetResult(args) {
  const octokit = new _actions_github__WEBPACK_IMPORTED_MODULE_1__.GitHub(Object(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)("token", { required: true }));
  const result = await octokit.graphql(_query_gql__WEBPACK_IMPORTED_MODULE_2___default.a, args);
  const edges = Object(lodash_es__WEBPACK_IMPORTED_MODULE_3__.get)(result, "repository.ref.target.deployments.edges");
  if (!edges) return null;
  return Object(lodash_es__WEBPACK_IMPORTED_MODULE_3__.get)(edges, `[0].node.latestStatus.environmentUrl`, null);
}

async function run() {
  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const branch =
      process.env.GITHUB_HEAD_REF ||
      process.env.GITHUB_REF.match(/(?<=refs\/heads\/).+/g)[0];
    const retryInterval = Number(Object(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)("retryInterval"));

    const args = { repo, owner, branch };
    console.log("Starting to run with following input:", args);

    const deployment = await getDeployment(args, retryInterval);
    Object(_actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput)("deployment", deployment);
    console.log("Deployment set: ", JSON.stringify(deployment));
  } catch (error) {
    Object(_actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed)(error.message);
  }
}

run();


/***/ }),

/***/ 813:
/***/ (function(module) {

module.exports = eval("require")("lodash-es");


/***/ }),

/***/ 948:
/***/ (function(module) {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ },
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function getDefault() { return module['default']; } :
/******/ 				function getModuleExports() { return module; };
/******/ 			__webpack_require__.d(getter, 'a', getter);
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getter */
/******/ 	!function() {
/******/ 		// define getter function for harmony exports
/******/ 		var hasOwnProperty = Object.prototype.hasOwnProperty;
/******/ 		__webpack_require__.d = function(exports, name, getter) {
/******/ 			if(!hasOwnProperty.call(exports, name)) {
/******/ 				Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);