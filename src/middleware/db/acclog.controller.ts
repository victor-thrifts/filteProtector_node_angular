import { HttpClient, HttpHeaders }from '@angular/common/http';

// routes
import {apirouter} from '../apirouter';


import * as acclogService from './db_acclog.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

apirouter.get('/accloges/getCount', getCount);
apirouter.get('/accloges/getCountByQuery', getCountByQuery);
apirouter.get('/accloges', getAll);
apirouter.get('/accloges/:id', getById);
//apirouter.put('/accloges/:id');
//apirouter.delete('/accloges/:id');

  /* GET accloges whose name contains search term */
function  searchAccloges(req, res, next){
    acclogService.getByName(req.params.FileName)
      .then(acclogs => res.json(acclogs))
      .catch(err => next(err));
  }

function getCount(req, res, next){
  acclogService.getByCount()
      .then(count => res.send(count))
      .catch(err => next(err));
}
function getCountByQuery(req, res, next){
  let FileName: string = req.query.FileName;
  let UserName: string = req.query.UserName;
  let AccessType: string = req.query.AccessType;
  acclogService.getCountByQuery(FileName,UserName,AccessType)
      .then(count => res.send(count))
      .catch(err => next(err));
}

function getAll(req, res, next) {
  let page: number = req.query.page;
  let pageSize: number = req.query.pageSize;
  let FileName: string = req.query.FileName;
  let UserName: string = req.query.UserName;
  let AccessType: string = req.query.AccessType;
  let startIndex: number = (page - 1)* pageSize;
  acclogService.getAll(startIndex.valueOf(),pageSize.valueOf(),FileName,UserName,AccessType)
      .then(acclogs => res.json(acclogs))
      .catch(err => next(err));
}

function getById(req, res, next) {
  acclogService.getById(req.params.id)
      .then(acclog => acclog ? res.json(acclog) : res.sendStatus(404))
      .catch(err => next(err));
}

