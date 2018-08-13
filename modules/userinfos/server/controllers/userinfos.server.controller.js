'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Userinfo = mongoose.model('Userinfo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Userinfo
 */
exports.create = function(req, res) {
  var userinfo = new Userinfo(req.body);
  userinfo.user = req.user;

  userinfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userinfo);
    }
  });
};

/**
 * Show the current Userinfo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userinfo = req.userinfo ? req.userinfo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userinfo.isCurrentUserOwner = req.user && userinfo.user && userinfo.user._id.toString() === req.user._id.toString();

  res.jsonp(userinfo);
};

/**
 * Update a Userinfo
 */
exports.update = function(req, res) {
  var userinfo = req.userinfo;

  userinfo = _.extend(userinfo, req.body);

  userinfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userinfo);
    }
  });
};

/**
 * Delete an Userinfo
 */
exports.delete = function(req, res) {
  var userinfo = req.userinfo;

  userinfo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userinfo);
    }
  });
};

/**
 * List of Userinfos
 */
exports.list = function(req, res) {
  Userinfo.find().sort('-created').populate('user', 'displayName').exec(function(err, userinfos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userinfos);
    }
  });
};

/**
 * Userinfo middleware
 */
exports.userinfoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userinfo is invalid'
    });
  }

  Userinfo.findById(id).populate('user', 'displayName').exec(function (err, userinfo) {
    if (err) {
      return next(err);
    } else if (!userinfo) {
      return res.status(404).send({
        message: 'No Userinfo with that identifier has been found'
      });
    }
    req.userinfo = userinfo;
    next();
  });
};
