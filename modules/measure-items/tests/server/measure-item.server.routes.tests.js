'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  MeasureItem = mongoose.model('MeasureItem'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  measureItem;

/**
 * Measure item routes tests
 */
describe('Measure item CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Measure item
    user.save(function () {
      measureItem = {
        name: 'Measure item name'
      };

      done();
    });
  });

  it('should be able to save a Measure item if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Measure item
        agent.post('/api/measureItems')
          .send(measureItem)
          .expect(200)
          .end(function (measureItemSaveErr, measureItemSaveRes) {
            // Handle Measure item save error
            if (measureItemSaveErr) {
              return done(measureItemSaveErr);
            }

            // Get a list of Measure items
            agent.get('/api/measureItems')
              .end(function (measureItemsGetErr, measureItemsGetRes) {
                // Handle Measure items save error
                if (measureItemsGetErr) {
                  return done(measureItemsGetErr);
                }

                // Get Measure items list
                var measureItems = measureItemsGetRes.body;

                // Set assertions
                (measureItems[0].user._id).should.equal(userId);
                (measureItems[0].name).should.match('Measure item name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Measure item if not logged in', function (done) {
    agent.post('/api/measureItems')
      .send(measureItem)
      .expect(403)
      .end(function (measureItemSaveErr, measureItemSaveRes) {
        // Call the assertion callback
        done(measureItemSaveErr);
      });
  });

  it('should not be able to save an Measure item if no name is provided', function (done) {
    // Invalidate name field
    measureItem.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Measure item
        agent.post('/api/measureItems')
          .send(measureItem)
          .expect(400)
          .end(function (measureItemSaveErr, measureItemSaveRes) {
            // Set message assertion
            (measureItemSaveRes.body.message).should.match('Please fill Measure item name');

            // Handle Measure item save error
            done(measureItemSaveErr);
          });
      });
  });

  it('should be able to update an Measure item if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Measure item
        agent.post('/api/measureItems')
          .send(measureItem)
          .expect(200)
          .end(function (measureItemSaveErr, measureItemSaveRes) {
            // Handle Measure item save error
            if (measureItemSaveErr) {
              return done(measureItemSaveErr);
            }

            // Update Measure item name
            measureItem.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Measure item
            agent.put('/api/measureItems/' + measureItemSaveRes.body._id)
              .send(measureItem)
              .expect(200)
              .end(function (measureItemUpdateErr, measureItemUpdateRes) {
                // Handle Measure item update error
                if (measureItemUpdateErr) {
                  return done(measureItemUpdateErr);
                }

                // Set assertions
                (measureItemUpdateRes.body._id).should.equal(measureItemSaveRes.body._id);
                (measureItemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Measure items if not signed in', function (done) {
    // Create new Measure item model instance
    var measureItemObj = new MeasureItem(measureItem);

    // Save the measureItem
    measureItemObj.save(function () {
      // Request Measure items
      request(app).get('/api/measureItems')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Measure item if not signed in', function (done) {
    // Create new Measure item model instance
    var measureItemObj = new MeasureItem(measureItem);

    // Save the Measure item
    measureItemObj.save(function () {
      request(app).get('/api/measureItems/' + measureItemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', measureItem.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Measure item with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/measureItems/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Measure item is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Measure item which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Measure item
    request(app).get('/api/measureItems/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Measure item with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Measure item if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Measure item
        agent.post('/api/measureItems')
          .send(measureItem)
          .expect(200)
          .end(function (measureItemSaveErr, measureItemSaveRes) {
            // Handle Measure item save error
            if (measureItemSaveErr) {
              return done(measureItemSaveErr);
            }

            // Delete an existing Measure item
            agent.delete('/api/measureItems/' + measureItemSaveRes.body._id)
              .send(measureItem)
              .expect(200)
              .end(function (measureItemDeleteErr, measureItemDeleteRes) {
                // Handle measureItem error error
                if (measureItemDeleteErr) {
                  return done(measureItemDeleteErr);
                }

                // Set assertions
                (measureItemDeleteRes.body._id).should.equal(measureItemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Measure item if not signed in', function (done) {
    // Set Measure item user
    measureItem.user = user;

    // Create new Measure item model instance
    var measureItemObj = new MeasureItem(measureItem);

    // Save the Measure item
    measureItemObj.save(function () {
      // Try deleting Measure item
      request(app).delete('/api/measureItems/' + measureItemObj._id)
        .expect(403)
        .end(function (measureItemDeleteErr, measureItemDeleteRes) {
          // Set message assertion
          (measureItemDeleteRes.body.message).should.match('User is not authorized');

          // Handle Measure item error error
          done(measureItemDeleteErr);
        });

    });
  });

  it('should be able to get a single Measure item that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Measure item
          agent.post('/api/measureItems')
            .send(measureItem)
            .expect(200)
            .end(function (measureItemSaveErr, measureItemSaveRes) {
              // Handle Measure item save error
              if (measureItemSaveErr) {
                return done(measureItemSaveErr);
              }

              // Set assertions on new Measure item
              (measureItemSaveRes.body.name).should.equal(measureItem.name);
              should.exist(measureItemSaveRes.body.user);
              should.equal(measureItemSaveRes.body.user._id, orphanId);

              // force the Measure item to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Measure item
                    agent.get('/api/measureItems/' + measureItemSaveRes.body._id)
                      .expect(200)
                      .end(function (measureItemInfoErr, measureItemInfoRes) {
                        // Handle Measure item error
                        if (measureItemInfoErr) {
                          return done(measureItemInfoErr);
                        }

                        // Set assertions
                        (measureItemInfoRes.body._id).should.equal(measureItemSaveRes.body._id);
                        (measureItemInfoRes.body.name).should.equal(measureItem.name);
                        should.equal(measureItemInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      MeasureItem.remove().exec(done);
    });
  });
});
