//const ENV_CONFIG import'./envConfig');
import ENV_CONFIG from './envConfig';

var Application = (function() {
  return {
    getDbConnectionRoute: function() {
      let mongoConnect;
      ENV_CONFIG.LOCAL.DB.USERNAME === ''
        ? (mongoConnect = ENV_CONFIG.LOCAL.DB.DBNAME)
        : (mongoConnect =
            ENV_CONFIG.LOCAL.DB.USERNAME +
            ':' +
            ENV_CONFIG.LOCAL.DB.PASSWORD +
            '@' +
            ENV_CONFIG.LOCAL.DB.DBNAME);

      return 'mongodb://' + mongoConnect;
    },
    getCurrentHost() {
      const port = ENV_CONFIG.LOCAL.PORT.toString();
      return ENV_CONFIG.LOCAL.HOST + ':' + port;
    }
  };
})();

module.exports = Application;
