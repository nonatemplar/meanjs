'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userinfo = mongoose.model('Userinfo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userinfo;

/**
 * Userinfo routes tests
 */
describe('Userinfo CRUD tests', function () {

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

    // Save a user to the test db and create new Userinfo
    user.save(function () {
      userinfo = {
        name: 'Userinfo name'
      };

      done();
    });
  });

  it('should be able to save a Userinfo if logged in', function (done) {
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

        // Save a new Userinfo
        agent.post('/api/userinfos')
          .send(userinfo)
          .expect(200)
          .end(function (userinfoSaveErr, userinfoSaveRes) {
            // Handle Userinfo save error
            if (userinfoSaveErr) {
              return done(userinfoSaveErr);
            }

            // Get a list of Userinfos
            agent.get('/api/userinfos')
              .end(function (userinfosGetErr, userinfosGetRes) {
                // Handle Userinfos save error
                if (userinfosGetErr) {
                  return done(userinfosGetErr);
                }

                // Get Userinfos list
                var userinfos = userinfosGetRes.body;

                // Set assertions
                (userinfos[0].user._id).should.equal(userId);
                (userinfos[0].name).should.match('Userinfo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userinfo if not logged in', function (done) {
    agent.post('/api/userinfos')
      .send(userinfo)
      .expect(403)
      .end(function (userinfoSaveErr, userinfoSaveRes) {
        // Call the assertion callback
        done(userinfoSaveErr);
      });
  });

  it('should not be able to save an Userinfo if no name is provided', function (done) {
    // Invalidate name field
    userinfo.name = '';

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

        // Save a new Userinfo
        agent.post('/api/userinfos')
          .send(userinfo)
          .expect(400)
          .end(function (userinfoSaveErr, userinfoSaveRes) {
            // Set message assertion
            (userinfoSaveRes.body.message).should.match('Please fill Userinfo name');

            // Handle Userinfo save error
            done(userinfoSaveErr);
          });
      });
  });

  it('should be able to update an Userinfo if signed in', function (done) {
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

        // Save a new Userinfo
        agent.post('/api/userinfos')
          .send(userinfo)
          .expect(200)
          .end(function (userinfoSaveErr, userinfoSaveRes) {
            // Handle Userinfo save error
            if (userinfoSaveErr) {
              return done(userinfoSaveErr);
            }

            // Update Userinfo name
            userinfo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userinfo
            agent.put('/api/userinfos/' + userinfoSaveRes.body._id)
              .send(userinfo)
              .expect(200)
              .end(function (userinfoUpdateErr, userinfoUpdateRes) {
                // Handle Userinfo update error
                if (userinfoUpdateErr) {
                  return done(userinfoUpdateErr);
                }

                // Set assertions
                (userinfoUpdateRes.body._id).should.equal(userinfoSaveRes.body._id);
                (userinfoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userinfos if not signed in', function (done) {
    // Create new Userinfo model instance
    var userinfoObj = new Userinfo(userinfo);

    // Save the userinfo
    userinfoObj.save(function () {
      // Request Userinfos
      request(app).get('/api/userinfos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userinfo if not signed in', function (done) {
    // Create new Userinfo model instance
    var userinfoObj = new Userinfo(userinfo);

    // Save the Userinfo
    userinfoObj.save(function () {
      request(app).get('/api/userinfos/' + userinfoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userinfo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userinfo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userinfos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userinfo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userinfo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userinfo
    request(app).get('/api/userinfos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userinfo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userinfo if signed in', function (done) {
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

        // Save a new Userinfo
        agent.post('/api/userinfos')
          .send(userinfo)
          .expect(200)
          .end(function (userinfoSaveErr, userinfoSaveRes) {
            // Handle Userinfo save error
            if (userinfoSaveErr) {
              return done(userinfoSaveErr);
            }

            // Delete an existing Userinfo
            agent.delete('/api/userinfos/' + userinfoSaveRes.body._id)
              .send(userinfo)
              .expect(200)
              .end(function (userinfoDeleteErr, userinfoDeleteRes) {
                // Handle userinfo error error
                if (userinfoDeleteErr) {
                  return done(userinfoDeleteErr);
                }

                // Set assertions
                (userinfoDeleteRes.body._id).should.equal(userinfoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userinfo if not signed in', function (done) {
    // Set Userinfo user
    userinfo.user = user;

    // Create new Userinfo model instance
    var userinfoObj = new Userinfo(userinfo);

    // Save the Userinfo
    userinfoObj.save(function () {
      // Try deleting Userinfo
      request(app).delete('/api/userinfos/' + userinfoObj._id)
        .expect(403)
        .end(function (userinfoDeleteErr, userinfoDeleteRes) {
          // Set message assertion
          (userinfoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userinfo error error
          done(userinfoDeleteErr);
        });

    });
  });

  it('should be able to get a single Userinfo that has an orphaned user reference', function (done) {
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

          // Save a new Userinfo
          agent.post('/api/userinfos')
            .send(userinfo)
            .expect(200)
            .end(function (userinfoSaveErr, userinfoSaveRes) {
              // Handle Userinfo save error
              if (userinfoSaveErr) {
                return done(userinfoSaveErr);
              }

              // Set assertions on new Userinfo
              (userinfoSaveRes.body.name).should.equal(userinfo.name);
              should.exist(userinfoSaveRes.body.user);
              should.equal(userinfoSaveRes.body.user._id, orphanId);

              // force the Userinfo to have an orphaned user reference
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

                    // Get the Userinfo
                    agent.get('/api/userinfos/' + userinfoSaveRes.body._id)
                      .expect(200)
                      .end(function (userinfoInfoErr, userinfoInfoRes) {
                        // Handle Userinfo error
                        if (userinfoInfoErr) {
                          return done(userinfoInfoErr);
                        }

                        // Set assertions
                        (userinfoInfoRes.body._id).should.equal(userinfoSaveRes.body._id);
                        (userinfoInfoRes.body.name).should.equal(userinfo.name);
                        should.equal(userinfoInfoRes.body.user, undefined);

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
      Userinfo.remove().exec(done);
    });
  });
});
