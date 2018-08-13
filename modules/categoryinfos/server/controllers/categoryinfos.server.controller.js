'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categoryinfo = mongoose.model('Categoryinfo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Categoryinfo
 */
exports.create = function(req, res) {
  var categoryinfo = new Categoryinfo(req.body);
  categoryinfo.user = req.user;

  categoryinfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryinfo);
    }
  });
};

/**
 * Show the current Categoryinfo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var categoryinfo = req.categoryinfo ? req.categoryinfo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  categoryinfo.isCurrentUserOwner = req.user && categoryinfo.user && categoryinfo.user._id.toString() === req.user._id.toString();

  res.jsonp(categoryinfo);
};

/**
 * Update a Categoryinfo
 */
exports.update = function(req, res) {
  var categoryinfo = req.categoryinfo;

  categoryinfo = _.extend(categoryinfo, req.body);

  categoryinfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryinfo);
    }
  });
};

/**
 * Delete an Categoryinfo
 */
exports.delete = function(req, res) {
  var categoryinfo = req.categoryinfo;

  categoryinfo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryinfo);
    }
  });
};

/**
 * List of Categoryinfos
 */
exports.list = function(req, res) {
  Categoryinfo.find().sort('-created').populate('user', 'displayName').exec(function(err, categoryinfos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(categoryinfos);
    }
  });
};

/**
 * Categoryinfo middleware
 */
exports.categoryinfoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Categoryinfo is invalid'
    });
  }

  Categoryinfo.findById(id).populate('user', 'displayName').exec(function (err, categoryinfo) {
    if (err) {
      return next(err);
    } else if (!categoryinfo) {
      return res.status(404).send({
        message: 'No Categoryinfo with that identifier has been found'
      });
    }
    req.categoryinfo = categoryinfo;
    next();
  });
};
