'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();
console.log(router);
router.get('/', controller.index);
router.get('/:userName', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
