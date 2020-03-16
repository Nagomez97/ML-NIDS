const core = require('../core/core');

//This is an example setRoutes function
//Every connector must to have this type of routes configuration
//We don't use Router (express) due to some misunderstunding between that module and Keycloak module
function setRoutes(app) {
    //route to get an audit by the id in the query params
    app.post('/api/sniffer/start', core.startSniffer);
    app.post('/api/sniffer/stop', core.stopSniffer);
    app.post('/api/sniffer/reset', core.resetSniffer);
    
}

module.exports = {
    setRoutes
};