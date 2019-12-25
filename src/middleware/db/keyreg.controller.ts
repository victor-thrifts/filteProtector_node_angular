import {apirouter} from '../apirouter';
import * as  keyregService from './db_keyreg.service';

// routes
apirouter.post('/soft/register', register);
apirouter.get('/soft/authenticate', authenticate);

//module.exports = apirouter;

function register(req, res, next) {
    keyregService.save(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function authenticate(req, res, next) {
    keyregService.authsoft()
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
