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
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const mongoDB_1 = require("../database/mongoDB");
const router = express_1.default.Router();
router.put('/sync', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------not sync START[7]------------------------');
        let index = 1;
        const oldNotList = yield (0, mongoDB_1.findByQuery)('noticeOfTeachers', {
            status: { $exists: false },
        });
        let updateNotResult;
        function updateNot(oldNotList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateNotQueries = [];
                for (const not of oldNotList) {
                    const noticeId = not._id.toString();
                    let newNotColor;
                    //확인하지 않은 알림장
                    const unconfirmNosListByNoticeId = yield (0, mongoDB_1.findByQuery)('noticeOfStudents', {
                        noticeId: noticeId,
                        confirm: false,
                        hide: false,
                    });
                    //체크리스트 상태 선택
                    if (unconfirmNosListByNoticeId.length === 0)
                        newNotColor = 'gray';
                    else
                        newNotColor = 'yellow';
                    updateNotQueries.push({
                        updateOne: {
                            filter: { _id: new mongodb_1.ObjectId(noticeId) },
                            update: {
                                $set: { status: newNotColor },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 === 0)
                        console.log('[', index, '/', oldNotList.length, ']', noticeId);
                    index++;
                }
                updateNotResult = yield (0, mongoDB_1.bulkWrite)('noticeOfTeachers', updateNotQueries);
            });
        }
        yield updateNot(oldNotList);
        console.log('----------------------not sync END[7]------------------------');
        return res.json(updateNotResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=noticeOfTeacher.js.map