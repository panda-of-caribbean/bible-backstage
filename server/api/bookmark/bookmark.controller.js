/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bookmarks              ->  index
 * POST    /api/bookmarks              ->  create
 * GET     /api/bookmarks/:id          ->  show
 * PUT     /api/bookmarks/:id          ->  upsert
 * PATCH   /api/bookmarks/:id          ->  patch
 * DELETE  /api/bookmarks/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Bookmark} from '../../sqldb';
import db from '../../sqldb';

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

// Gets a list of Bookmarks
export function index(req, res) {
  return Bookmark.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Bookmark from the DB
export function show(req, res) {
  return Bookmark.find({
    where: {
      user_id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


function indexVf(arr, index) {
  var ret = 0;
  var jsonObj =  JSON.parse(arr);
  var newArr = [];
  for(var i =0 ;i < jsonObj.length;i++){
    newArr[i] = jsonObj[i];
  }
  for(var j =0 ;j < newArr.length;j++){
    if (parseInt(newArr[j].user_id, 10) === parseInt(index, 10)) {
      ret = j;
      ret = Math.ceil((1-((ret+1)/newArr.length))*100);
    }
  }
  return ret;
}

// Creates a new Bookmark in the DB
export function create(req, res) {
  const reqBody = req.body;
  return Bookmark.find({
    where: {
        user_id: reqBody.user_id
    }
  }).then((entity => {
    if (entity) {
      Bookmark.update(reqBody, {
          where: {
            user_id: reqBody.user_id
          }
        })
        .then((entity) => {
          Bookmark.findAll({order:[
              ['duration', 'DESC']
          ]})
            .then((entity => {
              var result = JSON.stringify(entity);
              res.status(200).send({data: {rank: indexVf(result, reqBody.user_id), user_id: reqBody.user_id, duration: reqBody.duration}, status: 200});
            }))
        })
    } else {
      Bookmark.create(reqBody)
        .then((entity) => {
          entity.dataValues['rank'] = 0;
          res.status(200).send({data: entity.dataValues, status: 200});
        })
        .catch(handleError(res));
    }
  }));
}

// Upserts the given Bookmark in the DB at the specified ID
export function upsert(req, res) {
  if(req.body.book_id) {
    Reflect.deleteProperty(req.body, 'book_id');
  }

  return Bookmark.upsert(req.body, {
    where: {
      book_id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Bookmark in the DB
export function patch(req, res) {
  if(req.body.book_id) {
    Reflect.deleteProperty(req.body, 'book_id');
  }
  return Bookmark.find({
    where: {
      book_id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Bookmark from the DB
export function destroy(req, res) {
  return Bookmark.find({
    where: {
      book_id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
