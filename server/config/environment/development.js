'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

 // Sequelize connection opions
 //  sequelize: {
 //    uri: 'sqlite://',
 //    options: {
 //      logging: false,
 //      storage: 'dev.sqlite',
 //      define: {
 //        timestamps: false
 //      }
 //    }
 //  },

  // sequelize: {
  //   username: 'root',
  //   password: 'youpeng131',
  //   database: 'bibles',
  //   host: "localhost",
  //   dialect: 'mysql',
  //   define: {
  //     underscored: false,
  //     timestamps: true,
  //     paranoid: true
  //   }
  // },

  // Seed database on startup
  seedDB: true

};
