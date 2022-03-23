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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.put('/sync', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------studentBadges sync START[18]------------------------');
        const oldStudentBadgeList = yield (0, mongoDB_1.findByQuery)('badges_student', {
            timestamp: { $exists: true },
        });
        const oldStudentBadgeNum = oldStudentBadgeList.length;
        let updateStudentBagdeResult;
        let index = 1;
        function updateStudentBadge(oldStudentBadgeList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateStudentBadgeQueries = [];
                for (const studentBadge of oldStudentBadgeList) {
                    const studentCode = studentBadge.code;
                    let oldStudentBadgeInfo = studentBadge.badges;
                    let newStudentBadgeInfo = new Array(6);
                    oldStudentBadgeInfo.map((value, index) => (newStudentBadgeInfo[index] = value == '0' ? false : true));
                    updateStudentBadgeQueries.push({
                        updateOne: {
                            filter: { code: studentCode },
                            update: {
                                $set: {
                                    badges: newStudentBadgeInfo,
                                },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 === 0) {
                        console.log('[', index, '/', oldStudentBadgeNum, ']', studentCode);
                    }
                    index++;
                }
                updateStudentBagdeResult = yield (0, mongoDB_1.bulkWrite)('badges_student', updateStudentBadgeQueries);
            });
        }
        yield updateStudentBadge(oldStudentBadgeList);
        console.log('----------------------studentBadges sync END[18]------------------------');
        return res.json(updateStudentBagdeResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=badges_student.js.map