const PeerServer = require('peer').PeerServer;

var server = PeerServer({
    port: 9090,
    path: '/peerserver',
});

console.log("Srart PeerJS Server");