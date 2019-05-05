/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  upsert
 * PATCH   /api/users/:id          ->  patch
 * DELETE  /api/users/:id          ->  destroy
 */
// var secret = 'thankgodforgivingmefood001';
// var ss = entity.dataValues['password']; //这是user加密后的结果	赋值给变量ss
// var decipher = crypto.createDecipher('aes192', secret);
// var dec = decipher.update(ss, 'hex', 'utf8'); //编码方式从hex转为utf-8;
// dec += decipher.final('utf8'); //编码方式从utf-8;
// console.log(JSON.parse(dec));





'use strict';

import jsonpatch from 'fast-json-patch';
import {User} from '../../sqldb';
import jiami from 'utility';
import crypto from 'crypto';
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


//登录 注册
export function create(req, res) {
  const reqBody = req.body;
  if (reqBody.password) {
    var str = JSON.stringify(reqBody.password); //明文
    var secret = 'thankgodforgivingmefood001'; //密钥
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex'); //编码方式从utf-8转为hex;
    enc += cipher.final('hex'); //编码方式从转为hex;
    reqBody.password=enc;
  }
  // 第三方登录
  if (reqBody.login_type !== 'local') {
    return User.find({
      where: {
          $or: {
            pid: reqBody['pid'],
            device_id: reqBody['device_id']
          }
      }
    }).then((entity) => {
      if (entity) {
        if (entity.dataValues['images'].indexOf('facebook') === -1) {
          reqBody['images'] =  entity.dataValues['images'];
        }
        reqBody['user_id'] = entity.dataValues['user_id'];
        if (entity.dataValues['email'] && entity.dataValues['password']) {
          User.update(reqBody, {
            where: {
              device_id: reqBody['device_id']
            }
          })
          .then((entity) => {
            delete reqBody['password'];
            res.status(200).send({data: reqBody, status: 200});
          })
        } else {
          res.status(200).send({data: reqBody, status: 200});
        }

      } else {
        User.create(reqBody)
        .then((entity) => {
          if (entity.dataValues['password']) {
            delete entity.dataValues.password;
          }
          res.status(200).send({data: entity.dataValues, status: 200});
        })
      }
    })
  } else {
    return User.find({
      where: {
          email: reqBody['email']
      }
    }).then((entity) => {
      if (!entity) {
        if (reqBody['user_name'] && reqBody['email'] && reqBody['password']) {
          User.create(reqBody)
            .then((entity) => {
              if (entity.dataValues['password']) {
                delete entity.dataValues.password;
              }
              res.status(200).send({data: entity.dataValues, status: 200});
            })
        } else {
          res.status(400).send({error: {msg: '用户名或密码错误'}, status: 400});
        }

      } else {
        // pid
        if ((entity.dataValues['user_name'] || entity.dataValues['email']) &&
          entity.dataValues['pid'] && reqBody['password']) {
          User.update(reqBody, {
              where: {
                user_id: entity.dataValues['user_id']
              }
            })
            .then((entity) => {
              delete reqBody['password'];
              res.status(200).send({data: reqBody, status: 200});
            })
        } else {
          if (entity.dataValues['password'] === reqBody.password) {
            delete entity.dataValues.password;
            res.status(200).send({data: entity.dataValues, status: 200});
          } else {
            res.status(400).send({error: {msg: '用户名或密码错误'}, status: 400});
          }
        }

      }

    })
  }
}


// Creates a new User in the DB
// export function create(req, res) {
//   const reqBody = req.body;
//   console.log('yyyyyyyyy');
//   console.log(reqBody);
//   if (reqBody.password) {
//     reqBody.password=jiami.md5(reqBody.password);
//   }
//   return User.find({
//     where: {
//       $or: {
//         user_name: reqBody.user_name,
//         device_id: reqBody.device_id
//       }
//     }
// }).then((entity) => {
//     console.log('zzzzzzzzzz');
//     console.log(entity);
//     if (entity && (entity.dataValues['user_name'] === reqBody['user_name'] ||
//       (entity.dataValues['device_id'].indexOf(reqBody['device_id']) !== -1 ) && entity.dataValues['user_name'])) {
//       res.status(400).send({error : {msg: '该用户已存在或者该设备已经被绑定'}, status: 400});
//     } else if (entity && !entity.dataValues['user_name'] && entity.dataValues['device_id'] === reqBody['device_id']) {
//       User.update(reqBody, {
//           where: {
//             device_id: reqBody.device_id
//           }
//         })
//         .then((entity) => {
//           console.log('uuuuuuuuu');
//           console.log(entity);
//           res.status(200).send({data: reqBody, status: 200});
//         })
//     } else {
//       User.create(reqBody)
//         .then((entity) => {
//           console.log('xxxxxxxxx');
//           console.log(entity);
//           delete entity.dataValues.password;
//           res.status(200).send({data: entity.dataValues, status: 200});
//         })
//     }
//   })
// }

// Upserts the given User in the DB at the specified ID
export function upsert(req, res) {
  if(req.body.user_id) {
    delete req.body.user_id;
  }
  const reqBody = req.body;
  const path = 'client/assets/images/'+ Date.now() +'.png';
  if (reqBody.images) {
    var base64Data = reqBody.images.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(path, dataBuffer, function(err) {
      if(err){
        res.send(err);
      }else{
        reqBody.images = path.split('client')[1];
      }
    });
  }
  return User.update({images: path.split('client')[1]}, {
    where: {
      user_id: parseInt(req.params.id, 10)
    }
  })
    .then((entity) => {
      res.status(200).send({data: path.split('client')[1], status: 200});
    })
    .catch(handleError(res));
}

// Updates an existing User in the DB
export function patch(req, res) {
  if(req.body.user_id) {
    delete req.body.user_id;
  }
  return User.find({
    where: {
      user_id: req.params.id
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
      user_id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
