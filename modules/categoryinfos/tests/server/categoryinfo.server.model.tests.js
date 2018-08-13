'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoryinfo = mongoose.model('Categoryinfo');

/**
 * Globals
 */
var user,
  categoryinfo;

/**
 * Unit tests
 */
describe('Categoryinfo Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      categoryinfo = new Categoryinfo({
        name: 'Categoryinfo Name',
        desc: 'Test Desc',
        pic: 'Test pic',
        item_ids: '[id1,id2,id3]'
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return categoryinfo.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      categoryinfo.name = '';

      return categoryinfo.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Categoryinfo.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
