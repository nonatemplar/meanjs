'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoryinfo = mongoose.model('Categoryinfo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  categoryinfo;

/**
 * Categoryinfo routes tests
 */
describe('Categoryinfo CRUD tests', function () {

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

    // Save a user to the test db and create new Categoryinfo
    user.save(function () {
      categoryinfo = {
        name: 'Categoryinfo name'
      };

      done();
    });
  });

  it('should be able to save a Categoryinfo if logged in', function (done) {
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

        // Save a new Categoryinfo
        agent.post('/api/categoryinfos')
          .send(categoryinfo)
          .expect(200)
          .end(function (categoryinfoSaveErr, categoryinfoSaveRes) {
            // Handle Categoryinfo save error
            if (categoryinfoSaveErr) {
              return done(categoryinfoSaveErr);
            }

            // Get a list of Categoryinfos
            agent.get('/api/categoryinfos')
              .end(function (categoryinfosGetErr, categoryinfosGetRes) {
                // Handle Categoryinfos save error
                if (categoryinfosGetErr) {
                  return done(categoryinfosGetErr);
                }

                // Get Categoryinfos list
                var categoryinfos = categoryinfosGetRes.body;

                // Set assertions
                (categoryinfos[0].user._id).should.equal(userId);
                (categoryinfos[0].name).should.match('Categoryinfo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Categoryinfo if not logged in', function (done) {
    agent.post('/api/categoryinfos')
      .send(categoryinfo)
      .expect(403)
      .end(function (categoryinfoSaveErr, categoryinfoSaveRes) {
        // Call the assertion callback
        done(categoryinfoSaveErr);
      });
  });

  it('should not be able to save an Categoryinfo if no name is provided', function (done) {
    // Invalidate name field
    categoryinfo.name = '';

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

        // Save a new Categoryinfo
        agent.post('/api/categoryinfos')
          .send(categoryinfo)
          .expect(400)
          .end(function (categoryinfoSaveErr, categoryinfoSaveRes) {
            // Set message assertion
            (categoryinfoSaveRes.body.message).should.match('Please fill Categoryinfo name');

            // Handle Categoryinfo save error
            done(categoryinfoSaveErr);
          });
      });
  });

  it('should be able to update an Categoryinfo if signed in', function (done) {
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

        // Save a new Categoryinfo
        agent.post('/api/categoryinfos')
          .send(categoryinfo)
          .expect(200)
          .end(function (categoryinfoSaveErr, categoryinfoSaveRes) {
            // Handle Categoryinfo save error
            if (categoryinfoSaveErr) {
              return done(categoryinfoSaveErr);
            }

            // Update Categoryinfo name
            categoryinfo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Categoryinfo
            agent.put('/api/categoryinfos/' + categoryinfoSaveRes.body._id)
              .send(categoryinfo)
              .expect(200)
              .end(function (categoryinfoUpdateErr, categoryinfoUpdateRes) {
                // Handle Categoryinfo update error
                if (categoryinfoUpdateErr) {
                  return done(categoryinfoUpdateErr);
                }

                // Set assertions
                (categoryinfoUpdateRes.body._id).should.equal(categoryinfoSaveRes.body._id);
                (categoryinfoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Categoryinfos if not signed in', function (done) {
    // Create new Categoryinfo model instance
    var categoryinfoObj = new Categoryinfo(categoryinfo);

    // Save the categoryinfo
    categoryinfoObj.save(function () {
      // Request Categoryinfos
      request(app).get('/api/categoryinfos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Categoryinfo if not signed in', function (done) {
    // Create new Categoryinfo model instance
    var categoryinfoObj = new Categoryinfo(categoryinfo);

    // Save the Categoryinfo
    categoryinfoObj.save(function () {
      request(app).get('/api/categoryinfos/' + categoryinfoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', categoryinfo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Categoryinfo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categoryinfos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categoryinfo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Categoryinfo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Categoryinfo
    request(app).get('/api/categoryinfos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Categoryinfo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Categoryinfo if signed in', function (done) {
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

        // Save a new Categoryinfo
        agent.post('/api/categoryinfos')
          .send(categoryinfo)
          .expect(200)
          .end(function (categoryinfoSaveErr, categoryinfoSaveRes) {
            // Handle Categoryinfo save error
            if (categoryinfoSaveErr) {
              return done(categoryinfoSaveErr);
            }

            // Delete an existing Categoryinfo
            agent.delete('/api/categoryinfos/' + categoryinfoSaveRes.body._id)
              .send(categoryinfo)
              .expect(200)
              .end(function (categoryinfoDeleteErr, categoryinfoDeleteRes) {
                // Handle categoryinfo error error
                if (categoryinfoDeleteErr) {
                  return done(categoryinfoDeleteErr);
                }

                // Set assertions
                (categoryinfoDeleteRes.body._id).should.equal(categoryinfoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Categoryinfo if not signed in', function (done) {
    // Set Categoryinfo user
    categoryinfo.user = user;

    // Create new Categoryinfo model instance
    var categoryinfoObj = new Categoryinfo(categoryinfo);

    // Save the Categoryinfo
    categoryinfoObj.save(function () {
      // Try deleting Categoryinfo
      request(app).delete('/api/categoryinfos/' + categoryinfoObj._id)
        .expect(403)
        .end(function (categoryinfoDeleteErr, categoryinfoDeleteRes) {
          // Set message assertion
          (categoryinfoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Categoryinfo error error
          done(categoryinfoDeleteErr);
        });

    });
  });

  it('should be able to get a single Categoryinfo that has an orphaned user reference', function (done) {
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

          // Save a new Categoryinfo
          agent.post('/api/categoryinfos')
            .send(categoryinfo)
            .expect(200)
            .end(function (categoryinfoSaveErr, categoryinfoSaveRes) {
              // Handle Categoryinfo save error
              if (categoryinfoSaveErr) {
                return done(categoryinfoSaveErr);
              }

              // Set assertions on new Categoryinfo
              (categoryinfoSaveRes.body.name).should.equal(categoryinfo.name);
              should.exist(categoryinfoSaveRes.body.user);
              should.equal(categoryinfoSaveRes.body.user._id, orphanId);

              // force the Categoryinfo to have an orphaned user reference
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

                    // Get the Categoryinfo
                    agent.get('/api/categoryinfos/' + categoryinfoSaveRes.body._id)
                      .expect(200)
                      .end(function (categoryinfoInfoErr, categoryinfoInfoRes) {
                        // Handle Categoryinfo error
                        if (categoryinfoInfoErr) {
                          return done(categoryinfoInfoErr);
                        }

                        // Set assertions
                        (categoryinfoInfoRes.body._id).should.equal(categoryinfoSaveRes.body._id);
                        (categoryinfoInfoRes.body.name).should.equal(categoryinfo.name);
                        should.equal(categoryinfoInfoRes.body.user, undefined);

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
      Categoryinfo.remove().exec(done);
    });
  });
});
