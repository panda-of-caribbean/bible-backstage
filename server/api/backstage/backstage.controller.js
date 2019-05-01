/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/backstages              ->  index
 * POST    /api/backstages              ->  create
 * GET     /api/backstages/:id          ->  show
 * PUT     /api/backstages/:id          ->  upsert
 * PATCH   /api/backstages/:id          ->  patch
 * DELETE  /api/backstages/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Backstage} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Backstages
export function index(req, res) {
  return Backstage.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Backstage from the DB
export function show(req, res) {
  return Backstage.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Backstage in the DB
export function create(req, res) {
  console.log(req.body);
  if (req.body.name === 'admin' && req.body.password === 'thanksgod666') {
    return Backstage.create(req.body)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
  } else {
    res.status(400).send({msg: {message: '用户名或者密码错误'}, status: 400});
  }
}

// Upserts the given Backstage in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Backstage.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Backstage in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Backstage.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Backstage from the DB
export function destroy(req, res) {
  return Backstage.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
