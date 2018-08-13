'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Record = mongoose.model('Record'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  record;

/**
 * Record routes tests
 */
describe('Record CRUD tests', function () {

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

    // Save a user to the test db and create new Record
    user.save(function () {
      record = {
        name: 'Record name'
      };

      done();
    });
  });

  it('should be able to save a Record if logged in', function (done) {
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

        // Save a new Record
        agent.post('/api/records')
          .send(record)
          .expect(200)
          .end(function (recordSaveErr, recordSaveRes) {
            // Handle Record save error
            if (recordSaveErr) {
              return done(recordSaveErr);
            }

            // Get a list of Records
            agent.get('/api/records')
              .end(function (recordsGetErr, recordsGetRes) {
                // Handle Records save error
                if (recordsGetErr) {
                  return done(recordsGetErr);
                }

                // Get Records list
                var records = recordsGetRes.body;

                // Set assertions
                (records[0].user._id).should.equal(userId);
                (records[0].name).should.match('Record name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Record if not logged in', function (done) {
    agent.post('/api/records')
      .send(record)
      .expect(403)
      .end(function (recordSaveErr, recordSaveRes) {
        // Call the assertion callback
        done(recordSaveErr);
      });
  });

  it('should not be able to save an Record if no name is provided', function (done) {
    // Invalidate name field
    record.name = '';

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

        // Save a new Record
        agent.post('/api/records')
          .send(record)
          .expect(400)
          .end(function (recordSaveErr, recordSaveRes) {
            // Set message assertion
            (recordSaveRes.body.message).should.match('Please fill Record name');

            // Handle Record save error
            done(recordSaveErr);
          });
      });
  });

  it('should be able to update an Record if signed in', function (done) {
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

        // Save a new Record
        agent.post('/api/records')
          .send(record)
          .expect(200)
          .end(function (recordSaveErr, recordSaveRes) {
            // Handle Record save error
            if (recordSaveErr) {
              return done(recordSaveErr);
            }

            // Update Record name
            record.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Record
            agent.put('/api/records/' + recordSaveRes.body._id)
              .send(record)
              .expect(200)
              .end(function (recordUpdateErr, recordUpdateRes) {
                // Handle Record update error
                if (recordUpdateErr) {
                  return done(recordUpdateErr);
                }

                // Set assertions
                (recordUpdateRes.body._id).should.equal(recordSaveRes.body._id);
                (recordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Records if not signed in', function (done) {
    // Create new Record model instance
    var recordObj = new Record(record);

    // Save the record
    recordObj.save(function () {
      // Request Records
      request(app).get('/api/records')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Record if not signed in', function (done) {
    // Create new Record model instance
    var recordObj = new Record(record);

    // Save the Record
    recordObj.save(function () {
      request(app).get('/api/records/' + recordObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', record.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Record with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/records/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Record is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Record which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Record
    request(app).get('/api/records/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Record with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Record if signed in', function (done) {
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

        // Save a new Record
        agent.post('/api/records')
          .send(record)
          .expect(200)
          .end(function (recordSaveErr, recordSaveRes) {
            // Handle Record save error
            if (recordSaveErr) {
              return done(recordSaveErr);
            }

            // Delete an existing Record
            agent.delete('/api/records/' + recordSaveRes.body._id)
              .send(record)
              .expect(200)
              .end(function (recordDeleteErr, recordDeleteRes) {
                // Handle record error error
                if (recordDeleteErr) {
                  return done(recordDeleteErr);
                }

                // Set assertions
                (recordDeleteRes.body._id).should.equal(recordSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Record if not signed in', function (done) {
    // Set Record user
    record.user = user;

    // Create new Record model instance
    var recordObj = new Record(record);

    // Save the Record
    recordObj.save(function () {
      // Try deleting Record
      request(app).delete('/api/records/' + recordObj._id)
        .expect(403)
        .end(function (recordDeleteErr, recordDeleteRes) {
          // Set message assertion
          (recordDeleteRes.body.message).should.match('User is not authorized');

          // Handle Record error error
          done(recordDeleteErr);
        });

    });
  });

  it('should be able to get a single Record that has an orphaned user reference', function (done) {
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

          // Save a new Record
          agent.post('/api/records')
            .send(record)
            .expect(200)
            .end(function (recordSaveErr, recordSaveRes) {
              // Handle Record save error
              if (recordSaveErr) {
                return done(recordSaveErr);
              }

              // Set assertions on new Record
              (recordSaveRes.body.name).should.equal(record.name);
              should.exist(recordSaveRes.body.user);
              should.equal(recordSaveRes.body.user._id, orphanId);

              // force the Record to have an orphaned user reference
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

                    // Get the Record
                    agent.get('/api/records/' + recordSaveRes.body._id)
                      .expect(200)
                      .end(function (recordInfoErr, recordInfoRes) {
                        // Handle Record error
                        if (recordInfoErr) {
                          return done(recordInfoErr);
                        }

                        // Set assertions
                        (recordInfoRes.body._id).should.equal(recordSaveRes.body._id);
                        (recordInfoRes.body.name).should.equal(record.name);
                        should.equal(recordInfoRes.body.user, undefined);

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
      Record.remove().exec(done);
    });
  });
});
