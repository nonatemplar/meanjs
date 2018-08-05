'use strict';

/**
 * Module dependencies
 */
var measureItemsPolicy = require('../policies/measure-items.server.policy'),
  measureItems = require('../controllers/measure-items.server.controller');

module.exports = function(app) {
  // Measure items Routes
  app.route('/api/measure-items').all(measureItemsPolicy.isAllowed)
    .get(measureItems.list)
    .post(measureItems.create);

  app.route('/api/measure-items/:measureItemId').all(measureItemsPolicy.isAllowed)
    .get(measureItems.read)
    .put(measureItems.update)
    .delete(measureItems.delete);

  // Finish by binding the Measure item middleware
  app.param('measureItemId', measureItems.measureItemByID);
};
