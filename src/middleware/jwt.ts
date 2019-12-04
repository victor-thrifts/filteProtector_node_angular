import { Injectable, Inject } from "@angular/core";
const userService = require('./db/db_user.service');

const expressJwt = require('express-jwt');

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};

export function jwt() {
    const secret = "config.secret";
    return expressJwt({
        secret: secret,
        audience:  isRevoked,
        issuer: ''
    }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register'
        ]
    });
};

//module.exports = jwt;