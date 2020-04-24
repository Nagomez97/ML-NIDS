const core = require('../core/core');

//This is an example setRoutes function
//Every connector must to have this type of routes configuration
//We don't use Router (express) due to some misunderstunding between that module and Keycloak module
function setRoutes(app) {
    //route to get an audit by the id in the query params

    // Sniffer
    app.post('/api/sniffer/start', core.startSniffer);
    app.post('/api/sniffer/stop', core.stopSniffer);
    app.post('/api/sniffer/reset', core.resetSniffer);
    app.get('/api/sniffer/isRunning', core.isRunning);
    app.get('/api/sniffer/getInterfaces', core.getInterfaces);

    // Flows
    app.post('/api/ddbb/flows/destroyAll', core.destroyAllFlows);
    app.get('/api/ddbb/flows/getFromHour', core.getFromHour);
    app.get('/api/ddbb/flows/getCurrentHour', core.getCurrentHour);
    app.get('/api/ddbb/flows/getChartTrafficTime', core.getTimeTrafficData);
    app.get('/api/ddbb/flows/getIPTrafficData', core.getIPTrafficData);
    app.get('/api/ddbb/flows/getAttacksIPData', core.getAttacksIPData);

    // Targets
    app.post('/api/ddbb/ips/setTarget', core.setTarget);
    app.post('/api/ddbb/ips/removeTarget', core.removeTarget);
    app.get('/api/ddbb/ips/getTargets', core.getTargets);


    
}

module.exports = {
    setRoutes
};