'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MeasureItem = mongoose.model('MeasureItem');

/**
 * Globals
 */
var user,
  measureItem;

/**
 * Unit tests
 */
describe('Measure item Model Unit Tests:', function() {
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
      measureItem = new MeasureItem({
        name: 'Measure item Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return measureItem.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      measureItem.name = '';

      return measureItem.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    MeasureItem.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
