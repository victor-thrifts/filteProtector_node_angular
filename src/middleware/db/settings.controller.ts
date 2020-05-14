import { HttpClient, HttpHeaders }from '@angular/common/http';
import {apirouter} from '../apirouter';
import * as  settingsService from './db_settings.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// routes
apirouter.get('/setting/loading', loadSettings);
apirouter.put('/setting/update', update);

//module.exports = apirouter;
function loadSettings(req, res, next) {
  settingsService.loadSettings()
        .then(settings => res.json(settings))
        .catch(err => next(err));
}

function update(req, res, next) {
  settingsService.update(req.body,req.header("username"))
    .then(() => res.json({}))
    .catch(err => next(err));
}
