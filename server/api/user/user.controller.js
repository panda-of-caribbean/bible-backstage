/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  upsert
 * PATCH   /api/users/:id          ->  patch
 * DELETE  /api/users/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {User} from '../../sqldb';
import jiami from 'utility';
import fs from 'fs';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
    return function(entity) {
      if(entity) {
       res.status(statusCode).json(entity);
      }
      return null;
    };

}

function patchUpdates(patches) {
  return function(entity) {
    try {
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
      res.status(200).send({data:[], status: 200});
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

function BadRequest(req, res) {
    return res.status(400).send({message:'xxx'});
}

// Gets a list of Users
export function index(req, res) {
  return User.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single User from the DB
export function show(req, res) {
  return User.find({
    where: {
      user_name: req.params.userName
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new User in the DB
export function create(req, res) {
  const reqBody = req.body;
  console.log('yyyyyyyyy');
  console.log(reqBody);
  if (reqBody.password) {
    reqBody.password=jiami.md5(reqBody.password);
  }
  return User.find({
    where: {
      $or: {
        user_name: reqBody.user_name,
        device_id: reqBody.device_id
      }
    }
}).then((entity) => {
    console.log('zzzzzzzzzz');
    console.log(entity);
    if (entity && (entity.dataValues['user_name'] === reqBody['user_name'] ||
      (entity.dataValues['device_id'].indexOf(reqBody['device_id']) !== -1 ) && entity.dataValues['user_name'])) {
      res.status(400).send({error:'该用户已存在或者该设备已经被绑定', status: 400});
    } else if (entity && !entity.dataValues['user_name'] && entity.dataValues['device_id'] === reqBody['device_id']) {
      User.update(reqBody, {
          where: {
            device_id: reqBody.device_id
          }
        })
        .then((entity) => {
          console.log('uuuuuuuuu');
          console.log(entity);
          res.status(200).send({data: reqBody});
        })
    } else {
      User.create(reqBody)
        .then((entity) => {
          console.log('xxxxxxxxx');
          console.log(entity);
          delete entity.dataValues.password;
          res.status(200).send({data: entity.dataValues});
        })
    }
  })
}

// Upserts the given User in the DB at the specified ID
export function upsert(req, res) {
  if(req.body.id) {
    delete req.body.id;
  }
  const reqBody = req.body;
  const path = 'client/assets/images/'+ Date.now() +'.png';
  if (reqBody.head_url) {
    var base64Data = reqBody.head_url.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(path, dataBuffer, function(err) {
      if(err){
        res.send(err);
      }else{
        reqBody.head_url = path;
      }
    });
  }
  return User.update({head_url: path}, {
    where: {
      _id: parseInt(req.params.id, 10)
    }
  })
    .then((entity) => {
      res.status(200).send({data: path});
    })
    .catch(handleError(res));
}

// Updates an existing User in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a User from the DB
export function destroy(req, res) {
  return User.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
