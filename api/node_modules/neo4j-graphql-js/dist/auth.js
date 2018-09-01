"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Initial support for checking auth

/*
*  Check is context.req.error or context.error 
*  have been defined.
*/
var checkRequestError = exports.checkRequestError = function checkRequestError(context) {
  if (context && context.req && context.req.error) {
    return context.req.error;
  } else if (context && context.error) {
    return context.error;
  } else {
    return false;
  }
};