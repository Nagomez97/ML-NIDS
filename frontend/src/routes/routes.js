const server = require('../server/server');

//This is an example setRoutes function
//Every connector must to have this type of routes configuration
//We don't use Router (express) due to some misunderstunding between that module and Keycloak module
function setRoutes(app) {
    //route to get an audit by the id in the query params
    app.get('/', server.home);
    app.post('/login', server.login);
    
}

module.exports = {
    setRoutes
};