'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MeasureItem = mongoose.model('MeasureItem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Measure item
 */
exports.create = function(req, res) {
  var measureItem = new MeasureItem(req.body);
  measureItem.user = req.user;

  measureItem.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(measureItem);
    }
  });
};

/**
 * Show the current Measure item
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var measureItem = req.measureItem ? req.measureItem.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  measureItem.isCurrentUserOwner = req.user && measureItem.user && measureItem.user._id.toString() === req.user._id.toString();

  res.jsonp(measureItem);
};

/**
 * Update a Measure item
 */
exports.update = function(req, res) {
  var measureItem = req.measureItem;

  measureItem = _.extend(measureItem, req.body);

  measureItem.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(measureItem);
    }
  });
};

/**
 * Delete an Measure item
 */
exports.delete = function(req, res) {
  var measureItem = req.measureItem;

  measureItem.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(measureItem);
    }
  });
};

/**
 * List of Measure items
 */
exports.list = function(req, res) {
  MeasureItem.find().sort('-created').populate('user', 'displayName').exec(function(err, measureItems) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(measureItems);
    }
  });
};

/**
 * Measure item middleware
 */
exports.measureItemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Measure item is invalid'
    });
  }

  MeasureItem.findById(id).populate('user', 'displayName').exec(function (err, measureItem) {
    if (err) {
      return next(err);
    } else if (!measureItem) {
      return res.status(404).send({
        message: 'No Measure item with that identifier has been found'
      });
    }
    req.measureItem = measureItem;
    next();
  });
};
