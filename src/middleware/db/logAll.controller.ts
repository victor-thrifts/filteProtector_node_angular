import { HttpClient, HttpHeaders }from '@angular/common/http';

// routes
import {apirouter} from '../apirouter';


import * as logAllService from './db_logAll.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

apirouter.get('/logAlls/getCount', getCount);
apirouter.get('/logAlls/getCountByQuery', getCountByQuery);
apirouter.get('/logAlls/:id', getById);
apirouter.get('/logAlls', getAll);

/* GET accloges whose name contains search term */
function getCount(req, res, next){
  logAllService.getByCount()
      .then(count => res.send(count))
      .catch(err => next(err));
}
function getCountByQuery(req, res, next){
  console.log("调用后端+++++++++++++++++++++++++++++++++++");
  let FileName: string = req.query.FileName;
  let UserName: string = req.query.UserName;
  let AccessType: string = req.query.AccessType;
  logAllService.getCountByQuery('','','')
      .then(count => res.send(count))
      .catch(err => next(err));
}

function getAll(req, res, next) {
  console.log("调用后端+++++++++++++++++++++++++++++++++++");
  let page: number = req.query.page;
  let pageSize: number = req.query.pageSize;
  let FileName: string = req.query.FileName;
  let UserName: string = req.query.UserName;
  let AccessType: string = req.query.AccessType;
  let startIndex: number = (page - 1)* pageSize;
  logAllService.getAll(startIndex.valueOf(),pageSize.valueOf(),FileName,UserName,AccessType)
      .then(acclogs => res.json(acclogs))
      .catch(err => next(err));
}

function getById(req, res, next) {
  logAllService.getById(req.params.id)
      .then(acclog => acclog ? res.json(acclog) : res.sendStatus(404))
      .catch(err => next(err));
}

