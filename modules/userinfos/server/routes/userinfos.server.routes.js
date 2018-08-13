'use strict';

/**
 * Module dependencies
 */
var userinfosPolicy = require('../policies/userinfos.server.policy'),
  userinfos = require('../controllers/userinfos.server.controller');

module.exports = function(app) {
  // Userinfos Routes
  app.route('/api/userinfos').all(userinfosPolicy.isAllowed)
    .get(userinfos.list)
    .post(userinfos.create);

  app.route('/api/userinfos/:userinfoId').all(userinfosPolicy.isAllowed)
    .get(userinfos.read)
    .put(userinfos.update)
    .delete(userinfos.delete);

  // Finish by binding the Userinfo middleware
  app.param('userinfoId', userinfos.userinfoByID);
};
