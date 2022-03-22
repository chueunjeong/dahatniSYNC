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
const mongoDB_1 = require("../database/mongoDB");
const router = express_1.default.Router();
router.delete('/not-exist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------nos delete START[4]------------------------');
        const nosList = yield (0, mongoDB_1.aggregate)('noticeOfStudents', [
            {
                $addFields: {
                    fk: { $toObjectId: '$noticeId' },
                },
            },
            {
                $lookup: {
                    from: 'noticeOfTeachers',
                    localField: 'fk',
                    foreignField: '_id',
                    as: 'noticeInfo',
                },
            },
            { $match: { noticeInfo: [] } },
        ]);
        let nosObjectIdList = [];
        nosList.map((nos) => nosObjectIdList.push(nos._id));
        const deleteNosResult = yield (0, mongoDB_1.deleteMany)('noticeOfStudents', { _id: { $in: nosObjectIdList } });
        console.log('----------------------nos delete END[4]------------------------');
        return res.json(deleteNosResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/checked', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------nos sync START[5]------------------------');
        const updateNosSync = yield (0, mongoDB_1.updateMany)('noticeOfStudents', { noticeChecked: true }, {
            $set: { hide: false },
            $unset: { noticeChecked: '' },
            $rename: { timestamp: 'created', lastUpdate: 'updated' },
        });
        console.log('----------------------nos sync END[5]------------------------');
        return res.json(updateNosSync);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/unchecked', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------nos sync START[6]------------------------');
        const updateNosSync = yield (0, mongoDB_1.updateMany)('noticeOfStudents', { noticeChecked: false }, {
            $set: { hide: true },
            $unset: { noticeChecked: '' },
            $rename: { timestamp: 'created', lastUpdate: 'updated' },
        });
        console.log('----------------------nos sync END[6]------------------------');
        return res.json(updateNosSync);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=noticeOfStudent.js.map