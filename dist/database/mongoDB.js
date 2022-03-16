"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregate = exports.insertOne2 = exports.insertOne = exports.insertMany = exports.updateMany = exports.updateOne = exports.findBySkip = exports.findByLimit = exports.findBySort = exports.findByQuery = exports.findOne = exports.bulkWrite1000BatchInsert = exports.bulkWrite1000BatchUpdateOne = exports.bulkWrite = exports.findOneAndUpdate = exports.client = void 0;
const mongodb_1 = require("mongodb");
const MONGOID = 'admin';
const MONGOPASSWORD = '2dkdkanfek554kgsgnyyylakekjaa331245jdannde';
const DBNAME = 'dahatnitest';
const url = `mongodb://${MONGOID}:${MONGOPASSWORD}@3.36.124.15:27017`;
// const url = `mongodb://${MONGOID}:${MONGOPASSWORD}@3.39.10.60:27017`;
exports.client = new mongodb_1.MongoClient(url);
exports.client.connect().then((result) => {
    console.log('MongoDB connected correctly to server.');
    console.log('URL:', url);
    console.log('----------------------------------------------------------');
});
//SQL Query
const findOneAndUpdate = (_collection, _filter, _update, _option) => new Promise((resolve) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .findOneAndUpdate(_filter, _update, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            resolve(err);
        }
    });
});
exports.findOneAndUpdate = findOneAndUpdate;
const bulkWrite = (_collection, _operations, _option) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .bulkWrite(_operations, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            reject(err);
        }
    });
});
exports.bulkWrite = bulkWrite;
const bulkWrite1000BatchUpdateOne = (_collection, _operations, _option) => new Promise((resolve, reject) => {
    let bulkOp = exports.client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
    let operationList = _operations;
    let counter = 0;
    operationList.forEach(function (operation) {
        bulkOp.find(operation.filter).updateOne(operation.update);
        counter++;
        console.log('???', counter);
        if (counter % 500 == 0) {
            bulkOp.execute();
            bulkOp = exports.client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
        }
    });
    if (counter % 500 != 0) {
        bulkOp.execute();
    }
});
exports.bulkWrite1000BatchUpdateOne = bulkWrite1000BatchUpdateOne;
const bulkWrite1000BatchInsert = (_collection, _operations, _option) => new Promise((resolve, reject) => {
    let bulkOp = exports.client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
    let operationList = _operations;
    let counter = 0;
    operationList.forEach(function (operation) {
        bulkOp.insert(operation);
        counter++;
        console.log('!!!', counter);
        if (counter % 500 == 0) {
            bulkOp.execute();
            bulkOp = exports.client.db(DBNAME).collection(_collection).initializeOrderedBulkOp();
        }
    });
    if (counter % 500 != 0) {
        bulkOp.execute();
    }
});
exports.bulkWrite1000BatchInsert = bulkWrite1000BatchInsert;
const findOne = (_collection, _find, _option) => new Promise((resolve) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .findOne(_find, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            resolve(err);
        }
    });
});
exports.findOne = findOne;
const findByQuery = (_collection, _find, _option) => new Promise((resolve) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .find(_find, _option)
        .toArray((err, docs) => {
        if (!err) {
            resolve(docs);
        }
        else {
            resolve(err);
        }
    });
});
exports.findByQuery = findByQuery;
const findBySort = (_collection, _find, _sort) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .find(_find)
        .sort(_sort) // {_id: 1} {_id: -1} 오름차순 내림차순
        .toArray((err, docs) => {
        if (!err) {
            resolve(docs);
        }
        else {
            reject(err);
        }
    });
});
exports.findBySort = findBySort;
const findByLimit = (_collection, _find, _sort, _limit) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .find(_find)
        .sort(_sort)
        .limit(_limit)
        .toArray((err, docs) => {
        if (!err) {
            resolve(docs);
        }
        else {
            reject(err);
        }
    });
});
exports.findByLimit = findByLimit;
const findBySkip = (_collection, _find, _sort, _skip, _limit) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .find(_find)
        .sort(_sort)
        .skip(_skip)
        .limit(_limit)
        .toArray((err, docs) => {
        if (!err) {
            resolve(docs);
        }
        else {
            reject(err);
        }
    });
});
exports.findBySkip = findBySkip;
const updateOne = (_collection, _find, _action, _option) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .updateOne(_find, _action, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            reject(err);
        }
    });
}); // 자동 merge
exports.updateOne = updateOne;
const updateMany = (_collection, _find, _action, _option) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .updateMany(_find, _action, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            reject(err);
        }
    });
});
exports.updateMany = updateMany;
const insertMany = (_collection, _data, _option) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .insertMany(_data, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            reject(err);
        }
    });
});
exports.insertMany = insertMany;
const insertOne = (_collection, _data, _option) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .insertOne(_data, _option, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            resolve(err);
        }
    });
});
exports.insertOne = insertOne;
const insertOne2 = (_collection, _data) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .insertOne(_data, (err, result) => {
        if (!err) {
            resolve(result);
        }
        else {
            reject(err);
        }
    });
});
exports.insertOne2 = insertOne2;
const aggregate = (_collection, _find) => new Promise((resolve, reject) => {
    exports.client
        .db(DBNAME)
        .collection(_collection)
        .aggregate(_find)
        .toArray((err, docs) => {
        if (!err) {
            resolve(docs);
        }
        else {
            reject(err);
        }
    });
});
exports.aggregate = aggregate;
//# sourceMappingURL=mongoDB.js.map