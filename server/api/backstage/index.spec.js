'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var backstageCtrlStub = {
  index: 'backstageCtrl.index',
  show: 'backstageCtrl.show',
  create: 'backstageCtrl.create',
  upsert: 'backstageCtrl.upsert',
  patch: 'backstageCtrl.patch',
  destroy: 'backstageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var backstageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './backstage.controller': backstageCtrlStub
});

describe('Backstage API Router:', function() {
  it('should return an express router instance', function() {
    expect(backstageIndex).to.equal(routerStub);
  });

  describe('GET /api/backstages', function() {
    it('should route to backstage.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'backstageCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/backstages/:id', function() {
    it('should route to backstage.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'backstageCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/backstages', function() {
    it('should route to backstage.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'backstageCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/backstages/:id', function() {
    it('should route to backstage.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'backstageCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/backstages/:id', function() {
    it('should route to backstage.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'backstageCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/backstages/:id', function() {
    it('should route to backstage.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'backstageCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
