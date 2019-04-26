'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBookmark;

describe('Bookmark API:', function() {
  describe('GET /api/bookmarks', function() {
    var bookmarks;

    beforeEach(function(done) {
      request(app)
        .get('/api/bookmarks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          bookmarks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(bookmarks).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/bookmarks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bookmarks')
        .send({
          name: 'New Bookmark',
          info: 'This is the brand new bookmark!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBookmark = res.body;
          done();
        });
    });

    it('should respond with the newly created bookmark', function() {
      expect(newBookmark.name).to.equal('New Bookmark');
      expect(newBookmark.info).to.equal('This is the brand new bookmark!!!');
    });
  });

  describe('GET /api/bookmarks/:id', function() {
    var bookmark;

    beforeEach(function(done) {
      request(app)
        .get(`/api/bookmarks/${newBookmark._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          bookmark = res.body;
          done();
        });
    });

    afterEach(function() {
      bookmark = {};
    });

    it('should respond with the requested bookmark', function() {
      expect(bookmark.name).to.equal('New Bookmark');
      expect(bookmark.info).to.equal('This is the brand new bookmark!!!');
    });
  });

  describe('PUT /api/bookmarks/:id', function() {
    var updatedBookmark;

    beforeEach(function(done) {
      request(app)
        .put(`/api/bookmarks/${newBookmark._id}`)
        .send({
          name: 'Updated Bookmark',
          info: 'This is the updated bookmark!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBookmark = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBookmark = {};
    });

    it('should respond with the updated bookmark', function() {
      expect(updatedBookmark.name).to.equal('Updated Bookmark');
      expect(updatedBookmark.info).to.equal('This is the updated bookmark!!!');
    });

    it('should respond with the updated bookmark on a subsequent GET', function(done) {
      request(app)
        .get(`/api/bookmarks/${newBookmark._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let bookmark = res.body;

          expect(bookmark.name).to.equal('Updated Bookmark');
          expect(bookmark.info).to.equal('This is the updated bookmark!!!');

          done();
        });
    });
  });

  describe('PATCH /api/bookmarks/:id', function() {
    var patchedBookmark;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/bookmarks/${newBookmark._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Bookmark' },
          { op: 'replace', path: '/info', value: 'This is the patched bookmark!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBookmark = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBookmark = {};
    });

    it('should respond with the patched bookmark', function() {
      expect(patchedBookmark.name).to.equal('Patched Bookmark');
      expect(patchedBookmark.info).to.equal('This is the patched bookmark!!!');
    });
  });

  describe('DELETE /api/bookmarks/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/bookmarks/${newBookmark._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bookmark does not exist', function(done) {
      request(app)
        .delete(`/api/bookmarks/${newBookmark._id}`)
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
