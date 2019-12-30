import { HttpClient, HttpHeaders }from '@angular/common/http';
// routes
import {apirouter} from '../apirouter';
import * as logAllService from './db_logAll.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

apirouter.post('/logAlls/insertLogAll', insertLogAll);
apirouter.get('/logAlls/getCount', getCount);
apirouter.get('/logAlls/getCountByQuery', getCountByQuery);
apirouter.get('/logAlls/:id', getById);
apirouter.get('/logAlls', getAll);
/* GET logAlls whose name contains search term */
function getCount(req, res, next){
  logAllService.getByCount()
      .then(count => res.send(count))
      .catch(err => next(err));
}

function getCountByQuery(req, res, next){
  let Ip: string = req.query.Ip;
  let Module: string = req.query.Module;
  let UserName: string = req.query.UserName;
  let dateArray: string = req.query.dateArray;
  logAllService.getCountByQuery(Ip,Module,UserName,dateArray)
      .then(count => res.send(count))
      .catch(err => next(err));
}

function getAll(req, res, next) {
  let page: number = req.query.page;
  let pageSize: number = req.query.pageSize;
  let Ip: string = req.query.Ip;
  let Module: string = req.query.Module;
  let UserName: string = req.query.UserName;
  let dateArray: string = req.query.dateArray;
  let startIndex: number = (page - 1)* pageSize;
  logAllService.getAll(startIndex.valueOf(),pageSize.valueOf(),Ip,Module,UserName,dateArray)
      .then(logAlls => res.json(logAlls))
      .catch(err => next(err));
}

function getById(req, res, next) {
  logAllService.getById(req.params.id)
      .then(logAll => logAll ? res.json(logAll) : res.sendStatus(404))
      .catch(err => next(err));
}

function insertLogAll(req, res, next) {
  logAllService.insertLogAll(req.body)
  .catch(err => next(err));
}

