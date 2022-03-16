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
const mongoDB_1 = require("./../database/mongoDB");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.put('/sync', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------checklist sync START------------------------');
        let index = 1;
        const oldChecklist = yield (0, mongoDB_1.findByQuery)('checklist', {
            status: { $exists: false },
        });
        let updateChecklistResult;
        function updateChecklist(oldChecklist) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateChecklistQueries = [];
                for (const checklist of oldChecklist) {
                    const checklistId = checklist._id.toString();
                    let newChecklistColor;
                    //체크되지 않은 학생 체크리스트 목록
                    const uncheckCosByChecklistId = yield (0, mongoDB_1.findByQuery)('checklistOfStudent', {
                        checklistId: checklistId,
                        state: '',
                        hide: false,
                    });
                    //체크리스트 상태 선택
                    if (uncheckCosByChecklistId.length === 0)
                        newChecklistColor = 'gray';
                    else
                        newChecklistColor = 'green';
                    updateChecklistQueries.push({
                        updateOne: {
                            filter: { _id: new mongodb_1.ObjectId(checklistId) },
                            update: {
                                $set: { status: newChecklistColor },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    console.log('[', index, ']', checklistId);
                    index++;
                }
                updateChecklistResult = yield (0, mongoDB_1.bulkWrite)('checklist', updateChecklistQueries);
            });
        }
        yield updateChecklist(oldChecklist);
        console.log('----------------------checklist sync END------------------------');
        return res.json(updateChecklistResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=checklist.js.map