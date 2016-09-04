'use strict';

const Hapi = require('hapi');
const Good = require('good');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }


    // Add the route
    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {

            return reply('hello world');
        }
    });

    // Intro Route
    server.route({
        method: 'GET',
        path: '/intro',
        handler: function (request, reply) {
            reply.file('./public/intro.html');
        }
    });

    // Defaule Get Route
    server.route({
        method: 'GET',
        path: '/{name}',
        handler: function (request, reply) {
            reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
        }
    });
});

// Start the server
server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});