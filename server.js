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

        // load model
        var User = sequelize.define('user', {
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            nickName: {
                type: Sequelize.STRING
            }
        });

        // create model /table schema 
        // force used, be careful!
        User.sync({ force: true }).then(function () {

            // find the user of id : 2, if not create 
            User.create({ firstName: 'Burak', lastName: 'Donbay', nickName: 'burak.donbay' })
                .then(function () {

                });

            // log first user by id : 1
            User.findById(1).then(function (u) {
                if (u)
                    console.log("User:" + u.firstName + " " + u.lastName + " " + u.nickName);

                // update of the user by id : 1
                User.find({ where: { id: '1' } })
                    .then(function (user) {
                        // Check if record exists in database
                        console.log('update id of 1: ' + user);

                        if (user) {
                            user.updateAttributes({
                                nickName: 'Sourvil'
                            })
                                .then(function () {

                                    // log first user by id : 1
                                    User.findById(1).then(function (u) {
                                        if (u)
                                            console.log("User:" + u.firstName + " " + u.lastName + " " + u.nickName);

                                    });

                                })
                        }
                    });
            });
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

    // Intro Route
    server.route({
        method: 'GET',
        path: '/seq',
        handler: function (request, reply) {

            // load model
            var User = sequelize.define('user', {
                firstName: {
                    type: Sequelize.STRING
                },
                lastName: {
                    type: Sequelize.STRING
                },
                nickName: {
                    type: Sequelize.STRING
                }
            });
            // save user
            User.create({ firstName: 'Dilek', lastName: 'Donbay', nickName: 'dilek.donbay' })
                .then(function (u) {
                    return reply(u.nickName + ' is created. Id: ' + u.id);
                });
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