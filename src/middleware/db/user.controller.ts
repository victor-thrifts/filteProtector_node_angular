import {apirouter} from '../apirouter';
import * as  userService from './db_user.service';

// routes
apirouter.post('/users/authenticate', authenticate);
apirouter.post('/users/register', register);
apirouter.get('/users', getAll);
apirouter.get('/users/current', getCurrent);
apirouter.get('/users/:id', getById);
apirouter.put('/users/:id', update);
apirouter.delete('/users/:id/:remark', _delete);

//module.exports = apirouter;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body, req.header("username"))
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => {
            user ? res.json(user) : res.sendStatus(404);
        }).catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body, req.header("username"))
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
  console.log(1111);
    userService._delete(req.params.id, req.params.remark, req.header("username"))
        .then(() => res.json({}))
        .catch(err => next(err));
}
