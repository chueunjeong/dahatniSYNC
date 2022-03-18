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
const class_1 = require("./../common/class");
const mongoDB_1 = require("./../database/mongoDB");
const express_1 = __importDefault(require("express"));
const mongoDB_2 = require("../database/mongoDB");
const router = express_1.default.Router();
//repeat이 아예 없는 경우
router.put('/sync/null', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------pos sync START------------------------');
        const updatePosSync = yield (0, mongoDB_2.updateMany)('projectOfStudent', { repeat: { $exists: false } }, {
            $set: {
                repeat: false,
                repeatType: '',
                repeatData: [],
                completeCount: 0,
            },
            $unset: { read: '' },
            $rename: { timestamp: 'created', lastUpdate: 'updated' },
        });
        console.log('----------------------pos sync END------------------------');
        return res.json(updatePosSync);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/false', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------pos sync START------------------------');
        const updatePosSync = yield (0, mongoDB_2.updateMany)('projectOfStudent', { repeat: false }, {
            $rename: { timestamp: 'created', lastUpdate: 'updated' },
        });
        console.log('----------------------pos sync END------------------------');
        return res.json(updatePosSync);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------pos sync START------------------------');
        let index = 1;
        const allCountPos = yield (0, mongoDB_1.findByQuery)('projectOfStudent', {
            repeat: true,
            repeatType: 'count',
        });
        let updatePosResult;
        function updateCountPos(allCountPos) {
            return __awaiter(this, void 0, void 0, function* () {
                let updatePosQueries = [];
                for (const pos of allCountPos) {
                    let oldRepeatData = pos.repeatData;
                    let newRepeatData = new Array(oldRepeatData.length);
                    oldRepeatData.map((oldData, index) => (newRepeatData[index] = oldData.created == undefined ? new class_1.RepeatData(oldData.open) : oldRepeatData[index]));
                    updatePosQueries.push({
                        updateOne: {
                            filter: { _id: pos._id },
                            update: {
                                $set: { repeatData: newRepeatData },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    if (index % 100 === 0)
                        console.log('[', index, '/', allCountPos.length, ']', pos._id);
                    index++;
                }
                updatePosResult = yield (0, mongoDB_1.bulkWrite)('projectOfStudent', updatePosQueries);
            });
        }
        yield updateCountPos(allCountPos);
        console.log('----------------------pos sync END------------------------');
        return res.json(updatePosResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------pos sync START------------------------');
        let index = 1;
        const allDatePos = yield (0, mongoDB_1.findByQuery)('projectOfStudent', {
            repeat: true,
            repeatType: 'date',
        });
        let updatePosResult;
        function updateDatePos(allDatePos) {
            return __awaiter(this, void 0, void 0, function* () {
                let updatePosQueries = [];
                for (const pos of allDatePos) {
                    let oldRepeatData = pos.repeatData;
                    let newRepeatData = new Array(oldRepeatData.length);
                    oldRepeatData.map((oldData, index) => (newRepeatData[index] =
                        oldData.created == undefined ? new class_1.RepeatData(oldData.open, oldData.alertDate) : oldRepeatData[index]));
                    updatePosQueries.push({
                        updateOne: {
                            filter: { _id: pos._id },
                            update: {
                                $set: { repeatData: newRepeatData },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    console.log('[', index, '/', allDatePos.length, ']', pos._id);
                    index++;
                }
                updatePosResult = yield (0, mongoDB_1.bulkWrite)('projectOfStudent', updatePosQueries);
            });
        }
        yield updateDatePos(allDatePos);
        console.log('----------------------pos sync END------------------------');
        return res.json(updatePosResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=projectOfStudent.js.map