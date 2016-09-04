'use strict';


const Hapi = require('hapi');
const Good = require('good');
const Sequelize = require("sequelize");

var sequelize = new Sequelize('sequelize', 'seq_user', 'seq_password', {
    host: 'localhost',
    dialect: 'mssql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');

        var User = sequelize.define('user', {
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            }
        });

        // force: true will drop the table if it already exists
        User.sync().then(function () {
            // Table created
            return User.create({
                firstName: 'Burak',
                lastName: 'Donbay'
            });
        });

        User.findById(1).then(function (u) {
            // project will be an instance of Project and stores the content of the table entry
            // with id 123. if such an entry is not defined you will get null
            console.log("User:" + u.firstName + " " + u.lastName);
        });


    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

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