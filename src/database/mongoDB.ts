import { MongoClient } from 'mongodb';

const MONGOID: any = 'admin';
const MONGOPASSWORD: any = '2dkdkanfek554kgsgnyyylakekjaa331245jdannde';

const DBNAME = 'dahatnitest';
const url = `mongodb://${MONGOID}:${MONGOPASSWORD}@13.125.75.185:27017`;
// const url = `mongodb://${MONGOID}:${MONGOPASSWORD}@3.39.10.60:27017`;

export const client = new MongoClient(url);

client.connect().then((result: any) => {
  console.log('MongoDB connected correctly to server.');
  console.log('URL:', url);
  console.log('----------------------------------------------------------');
});

//SQL Query
export const findOneAndUpdate = (_collection: string, _filter: object, _update: object, _option?: object) =>
  new Promise((resolve) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .findOneAndUpdate(_filter, _update, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          resolve(err);
        }
      });
  });

export const bulkWrite = (_collection: string, _operations: any[], _option?: object) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .bulkWrite(_operations, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
  });

export const bulkWrite1000BatchUpdateOne = (_collection: string, _operations: any[], _option?: object) =>
  new Promise((resolve, reject) => {
    let bulkOp = client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
    let operationList = _operations;
    let counter = 0;

    operationList.forEach(function (operation) {
      bulkOp.find(operation.filter).updateOne(operation.update);
      counter++;
      console.log('???', counter);
      if (counter % 500 == 0) {
        bulkOp.execute();

        bulkOp = client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
      }
    });

    if (counter % 500 != 0) {
      bulkOp.execute();
    }
  });

export const bulkWrite1000BatchInsert = (_collection: string, _operations: any[], _option?: object) =>
  new Promise((resolve, reject) => {
    let bulkOp = client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
    let operationList = _operations;
    let counter = 0;

    operationList.forEach(function (operation) {
      bulkOp.insert(operation);
      counter++;
      console.log('!!!', counter);
      if (counter % 500 == 0) {
        bulkOp.execute();

        bulkOp = client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
      }
    });

    if (counter % 500 != 0) {
      bulkOp.execute();
    }
  });

export const findOne = (_collection: string, _find: object, _option?: object) =>
  new Promise((resolve) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .findOne(_find, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          resolve(err);
        }
      });
  });

export const findByQuery = (_collection: string, _find: object, _option?: object) =>
  new Promise((resolve) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .find(_find, _option)
      .toArray((err, docs) => {
        if (!err) {
          resolve(docs);
        } else {
          resolve(err);
        }
      });
  });

export const findBySort = (_collection: string, _find: object, _sort: any) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .find(_find)
      .sort(_sort) // {_id: 1} {_id: -1} 오름차순 내림차순
      .toArray((err, docs) => {
        if (!err) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
  });

export const findByLimit = (_collection: string, _find: object, _sort: any, _limit: number) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .find(_find)
      .sort(_sort)
      .limit(_limit)
      .toArray((err, docs) => {
        if (!err) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
  });

export const findBySkip = (_collection: string, _find: object, _sort: any, _skip: number, _limit: number) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .find(_find)
      .sort(_sort)
      .skip(_skip)
      .limit(_limit)
      .toArray((err, docs) => {
        if (!err) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
  });

export const updateOne = (_collection: string, _find: object, _action: object, _option?: object) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .updateOne(_find, _action, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
  }); // 자동 merge

export const updateMany = (_collection: string, _find: object, _action: object, _option?: object) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .updateMany(_find, _action, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
  });

export const insertMany = (_collection: string, _data: object[], _option?: object) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .insertMany(_data, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
  });

export const insertOne = (_collection: string, _data: object, _option?: object) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .insertOne(_data, _option, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          resolve(err);
        }
      });
  });

export const insertOne2 = (_collection: string, _data: object) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .insertOne(_data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
  });

export const aggregate = (_collection: string, _find: object[]) =>
  new Promise((resolve, reject) => {
    client
      .db(DBNAME)
      .collection(_collection)
      .aggregate(_find)
      .toArray((err, docs) => {
        if (!err) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
  });