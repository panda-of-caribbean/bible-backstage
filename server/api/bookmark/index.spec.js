'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var bookmarkCtrlStub = {
  index: 'bookmarkCtrl.index',
  show: 'bookmarkCtrl.show',
  create: 'bookmarkCtrl.create',
  upsert: 'bookmarkCtrl.upsert',
  patch: 'bookmarkCtrl.patch',
  destroy: 'bookmarkCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bookmarkIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './bookmark.controller': bookmarkCtrlStub
});

describe('Bookmark API Router:', function() {
  it('should return an express router instance', function() {
    expect(bookmarkIndex).to.equal(routerStub);
  });

  describe('GET /api/bookmarks', function() {
    it('should route to bookmark.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'bookmarkCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/bookmarks/:id', function() {
    it('should route to bookmark.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'bookmarkCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/bookmarks', function() {
    it('should route to bookmark.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'bookmarkCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/bookmarks/:id', function() {
    it('should route to bookmark.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'bookmarkCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/bookmarks/:id', function() {
    it('should route to bookmark.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'bookmarkCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/bookmarks/:id', function() {
    it('should route to bookmark.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'bookmarkCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
