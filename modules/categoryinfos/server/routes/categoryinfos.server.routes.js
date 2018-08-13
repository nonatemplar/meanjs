'use strict';

/**
 * Module dependencies
 */
var categoryinfosPolicy = require('../policies/categoryinfos.server.policy'),
  categoryinfos = require('../controllers/categoryinfos.server.controller');

module.exports = function(app) {
  // Categoryinfos Routes
  app.route('/api/categoryinfos').all(categoryinfosPolicy.isAllowed)
    .get(categoryinfos.list)
    .post(categoryinfos.create);

  app.route('/api/categoryinfos/:categoryinfoId').all(categoryinfosPolicy.isAllowed)
    .get(categoryinfos.read)
    .put(categoryinfos.update)
    .delete(categoryinfos.delete);

  // Finish by binding the Categoryinfo middleware
  app.param('categoryinfoId', categoryinfos.categoryinfoByID);
};
