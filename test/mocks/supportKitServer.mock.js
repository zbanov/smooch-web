'use strict';

var _ = require('underscore');
var BaseServerMock = require('./baseServerMock');

var conversationStore = require('../data/conversations');
var appData = require('../data/app');

module.exports = BaseServerMock.extend({
    routes: [
        [
            'OPTIONS', /.*/, [200, {
                'Access-Control-Allow-Origin': '*',
                'Vary': 'Origin',
                'Access-Control-Allow-Methods': ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
                'Access-Control-Allow-Headers': ['accept', 'app-token', 'content-type'],
                'Connection': 'keep-alive'
            }, '']
        ],
        [
            'GET', /\/faye.*/, [200, {}, '']
        ],
        [
            'POST', /\/api\/appboot/, function(xhr) {
                var body = JSON.parse(xhr.requestBody);

                var data = _.extend({
                    appUserId: _.uniqueId()
                }, appData);

                _.extend(data.appUser, {
                    _id: data.appUserId
                });

                if (body.userId) {
                    _.extend(data.appUser, {
                        userId: body.userId
                    });
                }

                xhr.respond(201, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(data));
            }
        ],
        [
            'POST', /\/v1\/appusers\/([a-z0-9]+)\/event/, function(xhr) {
                xhr.respond(204, {
                    'Content-Type': 'application/json'
                }, undefined);
            }
        ],
        [
            'PUT', /\/v1\/appusers\/([a-z0-9]+)/, function(xhr /*, id*/ ) {
                var requestBody = _.isString(xhr.requestBody) ? JSON.parse(xhr.requestBody) : xhr.requestBody;
                var body = {
                    appUser: requestBody
                };

                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(body));
            }
        ],
        [
            'GET', /\/v1\/appusers\/([a-z0-9]+)\/conversation/, [200, {
                'Content-Type': 'application/json'
            }, JSON.stringify(_(conversationStore).values())]
        ],
        [
            'POST', /\/v1\/appusers\/([a-z0-9]+)\/conversation/, [200, {
                'Content-Type': 'application/json'
            }, JSON.stringify({
                _id: '123123'
            })]
        ],
        [
            'POST', /\/v1\/appusers\/([a-z0-9]+)\/conversation\/messages/, function(xhr) {
                xhr.respond(201, {
                    'Content-Type': 'application/json'
                }, _.isString(xhr.requestBody) ? xhr.requestBody : JSON.stringify(xhr.requestBody));
            }
        ]
    ]
});
