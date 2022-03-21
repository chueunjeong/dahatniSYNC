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
const mongoDB_1 = require("./../database/mongoDB");
const class_1 = require("./../common/class");
const statusDecision_1 = require("./../common/statusDecision");
const express_1 = __importDefault(require("express"));
const mongoDB_2 = require("../database/mongoDB");
const router = express_1.default.Router();
router.put('/sync', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------student sync START------------------------');
        const oldStudentList = yield (0, mongoDB_2.findByQuery)('students', {
            timestamp: { $exists: true },
            //code: 'w6LWgR8JW',
        });
        const oldStudentNum = oldStudentList.length;
        let updateStudentResult;
        let index = 1;
        function updateStudent(oldStudentList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateStudentQueries = [];
                let insertStudentBadgeQueries = [];
                for (const student of oldStudentList) {
                    const studentCode = student.code;
                    let studentStatusInfo = new Array(2);
                    /*****************************status************************************** */
                    const posListByStudentCode = yield (0, mongoDB_2.findByQuery)('projectOfStudent', {
                        code: studentCode,
                        hide: false,
                        project_hide: false,
                    });
                    const unconfirmNosByStudentCode = yield (0, mongoDB_2.findByQuery)('noticeOfStudents', {
                        code: studentCode,
                        confirm: false,
                        hide: false,
                    });
                    const studentProjectStatus = (0, statusDecision_1.decideNewProjectStatusColor)(posListByStudentCode);
                    //과제 제출한 것이 있을 경우
                    if (studentProjectStatus == 'red') {
                        const blankPosList = posListByStudentCode.filter((pos) => pos.state == '');
                        //아직 안한 과제와 아직 확인 안한 알림장이 없을 경우
                        if (blankPosList.length === 0 && unconfirmNosByStudentCode.length === 0)
                            studentStatusInfo = ['red', 'gray'];
                        else
                            studentStatusInfo = ['red', 'yellow'];
                    }
                    //과제 제출하지 않은 것이 있을 경우
                    if (studentProjectStatus == 'yellow') {
                        studentStatusInfo = ['yellow', 'yellow'];
                    }
                    //모든 과제가 완료되었을 경우
                    if (studentProjectStatus == 'gray') {
                        if (unconfirmNosByStudentCode.length === 0) {
                            const uncheckCosListByStudentCode = yield (0, mongoDB_2.findByQuery)('checklistOfStudent', {
                                code: studentCode,
                                hide: false,
                                state: '',
                            });
                            if (unconfirmNosByStudentCode.length === 0)
                                studentStatusInfo = ['gray', 'gray'];
                            else
                                studentStatusInfo = ['green', 'gray'];
                        }
                        else
                            studentStatusInfo = ['yellow', 'yellow'];
                    }
                    /*****************************cookies************************************** */
                    //학생들이 해당 과제에 대해 받은 쿠키 조회
                    const cookiesNumByStudentCode = yield (0, mongoDB_2.aggregate)('projectOfStudent', [
                        {
                            $match: {
                                code: studentCode,
                            },
                        },
                        {
                            $group: {
                                _id: '$code',
                                cookiesNum: {
                                    $sum: '$cookie',
                                },
                            },
                        },
                    ]);
                    const studentCookies = cookiesNumByStudentCode.length === 0 ? 0 : cookiesNumByStudentCode[0].cookiesNum;
                    /*****************************badge************************************** */
                    const studentBadge = yield (0, mongoDB_1.findOne)('badges_student', { code: studentCode });
                    if (studentBadge == null) {
                        insertStudentBadgeQueries.push({
                            insertOne: { document: new class_1.StudentBadge(student.classId, student.userId, studentCode) },
                        });
                    }
                    updateStudentQueries.push({
                        updateOne: {
                            filter: { code: studentCode },
                            update: {
                                $set: {
                                    status: studentStatusInfo[0],
                                    iamdoneStatus: studentStatusInfo[1],
                                    cookie: studentCookies,
                                },
                                $unset: { checked: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 === 0) {
                        console.log('[', index, '/', oldStudentNum, ']', studentCode);
                    }
                    index++;
                }
                updateStudentResult = yield (0, mongoDB_1.bulkWrite)('students', updateStudentQueries);
                console.log('-----------------------------------------student update complete');
                console.log(updateStudentResult);
                if (insertStudentBadgeQueries.length !== 0) {
                    const insertStudentBadgeListResult = yield (0, mongoDB_1.bulkWrite)('badges_student', insertStudentBadgeQueries);
                    console.log('-----------------------------------------student badge insert complete');
                    console.log(insertStudentBadgeListResult);
                }
            });
        }
        yield updateStudent(oldStudentList);
        console.log('----------------------student sync END------------------------');
        return res.json(updateStudentResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=students.js.map