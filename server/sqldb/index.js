/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';
// console.log(config.sequelize.uri);
// console.log(config.sequelize.options);
// var db = {
//   Sequelize,
//   sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
// };

var db = {
  Sequelize,
  sequelize: new Sequelize('awsbiblesuser', 'awsbiblesuser', 'awsqpzlyX123', {
    host: 'bibles.cgqlvp1j8ss3.sa-east-1.rds.amazonaws.com',
    dialect: 'mysql'
  })
};

// Insert models below
db.Backstage = db.sequelize.import('../api/backstage/backstage.model');
db.Bookmark = db.sequelize.import('../api/bookmark/bookmark.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');

module.exports = db;
