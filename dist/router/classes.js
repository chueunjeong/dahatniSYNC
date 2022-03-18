"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const express_1 = __importDefault(require("express"));
const class_1 = require("../common/class");
const statusDecision_1 = require("../common/statusDecision");
const mongoDB_1 = require("../database/mongoDB");
const router = express_1.default.Router();
router.put('/sync/null', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------class sync START------------------------');
        let index = 1;
        const oldClassList = yield (0, mongoDB_1.findByQuery)('class', {
            _id: new mongodb_1.ObjectId('60ee6bd985291054d37fce0d'),
        });
        const allClassCase = oldClassList.length;
        let updateProjectResult;
        function updateClass(oldClassList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateClassQueries = [];
                let insertBadgeQueries = [];
                for (const classInfo of oldClassList) {
                    const classId = classInfo._id.toString();
                    const userId = classInfo.userId;
                    let classCookies = 0;
                    /*****************************status************************************** */
                    const studentListByClassId = yield (0, mongoDB_1.findByQuery)('students', {
                        classId: classId,
                    });
                    const newClassStatus = (0, statusDecision_1.decideNewClassStatusColor)(studentListByClassId);
                    /*****************************cookie************************************** */
                    if (studentListByClassId.length !== 0) {
                        studentListByClassId.map((student) => (classCookies += student.cookie));
                    }
                    /*****************************badge************************************** */
                    const badge = yield (0, mongoDB_1.findOne)('badges_teacher', { classId: classId });
                    if (badge == null) {
                        insertBadgeQueries.push({ insertOne: { document: new class_1.ClassBadge(classId, userId) } });
                    }
                    updateClassQueries.push({
                        updateOne: {
                            filter: { _id: new mongodb_1.ObjectId(classId) },
                            update: {
                                $set: {
                                    status: newClassStatus,
                                    cookieHidden: true,
                                    targetAction: '',
                                    targetCookies: '',
                                    cookies: classCookies,
                                },
                                $unset: { sort: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 == 0)
                        console.log('[', index, '/', allClassCase, ']', ']', classId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('class', updateClassQueries);
                if (insertBadgeQueries.length !== 0) {
                    const insertBadgeListResult = yield (0, mongoDB_1.bulkWrite)('badges_teacher', insertBadgeQueries);
                }
            });
        }
        yield updateClass(oldClassList);
        console.log('----------------------class sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/true', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------class sync START------------------------');
        let index = 1;
        const oldClassList = yield (0, mongoDB_1.findByQuery)('class', {
            cookieHidden: 'true',
        });
        const allClassCase = oldClassList.length;
        let updateProjectResult;
        function updateClass(oldClassList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateClassQueries = [];
                let insertBadgeQueries = [];
                for (const classInfo of oldClassList) {
                    const classId = classInfo._id.toString();
                    const userId = classInfo.userId;
                    let classCookies = 0;
                    /*****************************status************************************** */
                    const studentListByClassId = yield (0, mongoDB_1.findByQuery)('students', {
                        classId: classId,
                    });
                    const newClassStatus = (0, statusDecision_1.decideNewClassStatusColor)(studentListByClassId);
                    /*****************************cookie************************************** */
                    if (studentListByClassId.length !== 0) {
                        studentListByClassId.map((student) => (classCookies += student.cookie));
                    }
                    /*****************************badge************************************** */
                    const badge = yield (0, mongoDB_1.findOne)('badges_teacher', { classId: classId });
                    if (badge == null) {
                        insertBadgeQueries.push({ insertOne: { document: new class_1.ClassBadge(classId, userId) } });
                    }
                    updateClassQueries.push({
                        updateOne: {
                            filter: { _id: new mongodb_1.ObjectId(classId) },
                            update: {
                                $set: {
                                    status: newClassStatus,
                                    cookieHidden: true,
                                    cookies: classCookies,
                                },
                                $unset: { sort: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 == 0)
                        console.log('[', index, '/', allClassCase, ']', ']', classId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('class', updateClassQueries);
                const insertBadgeListResult = yield (0, mongoDB_1.bulkWrite)('badges_teacher', insertBadgeQueries);
            });
        }
        yield updateClass(oldClassList);
        console.log('----------------------class sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/false', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------class sync START------------------------');
        let index = 1;
        const oldClassList = yield (0, mongoDB_1.findByQuery)('class', {
            cookieHidden: 'false',
        });
        const allClassCase = oldClassList.length;
        let updateProjectResult;
        function updateClass(oldClassList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateClassQueries = [];
                let insertBadgeQueries = [];
                for (const classInfo of oldClassList) {
                    const classId = classInfo._id.toString();
                    const userId = classInfo.userId;
                    let classCookies = 0;
                    /*****************************status************************************** */
                    const studentListByClassId = yield (0, mongoDB_1.findByQuery)('students', {
                        classId: classId,
                    });
                    const newClassStatus = (0, statusDecision_1.decideNewClassStatusColor)(studentListByClassId);
                    /*****************************cookie************************************** */
                    if (studentListByClassId.length !== 0) {
                        studentListByClassId.map((student) => (classCookies += student.cookie));
                    }
                    /*****************************badge************************************** */
                    const badge = yield (0, mongoDB_1.findOne)('badges_teacher', { classId: classId });
                    if (badge == null) {
                        insertBadgeQueries.push({ insertOne: { document: new class_1.ClassBadge(classId, userId) } });
                    }
                    updateClassQueries.push({
                        updateOne: {
                            filter: { _id: new mongodb_1.ObjectId(classId) },
                            update: {
                                $set: {
                                    status: newClassStatus,
                                    cookieHidden: false,
                                    cookies: classCookies,
                                },
                                $unset: { sort: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 == 0)
                        console.log('[', index, '/', allClassCase, ']', ']', classId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('class', updateClassQueries);
                const insertBadgeListResult = yield (0, mongoDB_1.bulkWrite)('badges_teacher', insertBadgeQueries);
            });
        }
        yield updateClass(oldClassList);
        console.log('----------------------class sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=classes.js.map