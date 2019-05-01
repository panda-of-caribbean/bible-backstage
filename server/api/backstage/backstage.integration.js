'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBackstage;

describe('Backstage API:', function() {
  describe('GET /api/backstages', function() {
    var backstages;

    beforeEach(function(done) {
      request(app)
        .get('/api/backstages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          backstages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(backstages).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/backstages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/backstages')
        .send({
          name: 'New Backstage',
          info: 'This is the brand new backstage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBackstage = res.body;
          done();
        });
    });

    it('should respond with the newly created backstage', function() {
      expect(newBackstage.name).to.equal('New Backstage');
      expect(newBackstage.info).to.equal('This is the brand new backstage!!!');
    });
  });

  describe('GET /api/backstages/:id', function() {
    var backstage;

    beforeEach(function(done) {
      request(app)
        .get(`/api/backstages/${newBackstage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          backstage = res.body;
          done();
        });
    });

    afterEach(function() {
      backstage = {};
    });

    it('should respond with the requested backstage', function() {
      expect(backstage.name).to.equal('New Backstage');
      expect(backstage.info).to.equal('This is the brand new backstage!!!');
    });
  });

  describe('PUT /api/backstages/:id', function() {
    var updatedBackstage;

    beforeEach(function(done) {
      request(app)
        .put(`/api/backstages/${newBackstage._id}`)
        .send({
          name: 'Updated Backstage',
          info: 'This is the updated backstage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBackstage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBackstage = {};
    });

    it('should respond with the updated backstage', function() {
      expect(updatedBackstage.name).to.equal('Updated Backstage');
      expect(updatedBackstage.info).to.equal('This is the updated backstage!!!');
    });

    it('should respond with the updated backstage on a subsequent GET', function(done) {
      request(app)
        .get(`/api/backstages/${newBackstage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let backstage = res.body;

          expect(backstage.name).to.equal('Updated Backstage');
          expect(backstage.info).to.equal('This is the updated backstage!!!');

          done();
        });
    });
  });

  describe('PATCH /api/backstages/:id', function() {
    var patchedBackstage;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/backstages/${newBackstage._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Backstage' },
          { op: 'replace', path: '/info', value: 'This is the patched backstage!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBackstage = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBackstage = {};
    });

    it('should respond with the patched backstage', function() {
      expect(patchedBackstage.name).to.equal('Patched Backstage');
      expect(patchedBackstage.info).to.equal('This is the patched backstage!!!');
    });
  });

  describe('DELETE /api/backstages/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/backstages/${newBackstage._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when backstage does not exist', function(done) {
      request(app)
        .delete(`/api/backstages/${newBackstage._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
