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
const statusDecision_1 = require("./../common/statusDecision");
const mongoDB_2 = require("../database/mongoDB");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.put('/sync/null', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------project sync START------------------------');
        let index = 1;
        const oldProjectList = yield (0, mongoDB_2.findByQuery)('projects', {
            repeat: { $exists: false },
        });
        let updateProjectResult;
        function updateNullProject(oldProjectList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateProjectQueries = [];
                let updatePosListQueries = [];
                for (const project of oldProjectList) {
                    const projectId = project._id.toString();
                    const project_hide = project.hide;
                    const posListByProjectId = yield (0, mongoDB_2.findByQuery)('projectOfStudent', { projectId: projectId });
                    const newProjectStatus = (0, statusDecision_1.decideNewProjectStatusColor)(posListByProjectId);
                    //과제 업데이트
                    updateProjectQueries.push({
                        updateOne: {
                            filter: { _id: project._id },
                            update: {
                                $set: {
                                    repeat: false,
                                    status: newProjectStatus,
                                    borderStatus: '',
                                    repeatType: '',
                                    repeatCount: 0,
                                },
                                $unset: { newProjectAlert: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    //과제 내 숙제 업데이트(숨김여부)
                    updatePosListQueries.push({
                        updateMany: {
                            filter: { projectId: projectId },
                            update: {
                                $set: {
                                    project_hide: project_hide,
                                    updated: +new Date(),
                                },
                            },
                        },
                    });
                    console.log('[', index, ']', projectId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('projects', updateProjectQueries);
                const updatePosListResult = yield (0, mongoDB_1.bulkWrite)('projectOfStudent', updatePosListQueries);
            });
        }
        yield updateNullProject(oldProjectList);
        console.log('----------------------project sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/false', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------project sync START------------------------');
        let index = 1;
        const oldProjectList = yield (0, mongoDB_2.findByQuery)('projects', {
            repeat: false,
        });
        let updateProjectResult;
        function updateFalseProject(oldProjectList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateProjectQueries = [];
                let updatePosListQueries = [];
                for (const project of oldProjectList) {
                    const projectId = project._id.toString();
                    const project_hide = project.hide;
                    const posListByProjectId = yield (0, mongoDB_2.findByQuery)('projectOfStudent', { projectId: projectId });
                    const newProjectStatus = (0, statusDecision_1.decideNewProjectStatusColor)(posListByProjectId);
                    //과제 업데이트
                    updateProjectQueries.push({
                        updateOne: {
                            filter: { _id: project._id },
                            update: {
                                $set: {
                                    status: newProjectStatus,
                                    borderStatus: '',
                                    repeatCount: 0,
                                },
                                $unset: { newProjectAlert: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    //과제 내 숙제 업데이트(숨김여부)
                    updatePosListQueries.push({
                        updateMany: {
                            filter: { projectId: projectId },
                            update: {
                                $set: {
                                    project_hide: project_hide,
                                    updated: +new Date(),
                                },
                            },
                        },
                    });
                    console.log('[', index, ']', projectId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('projects', updateProjectQueries);
                const updatePosListResult = yield (0, mongoDB_1.bulkWrite)('projectOfStudent', updatePosListQueries);
            });
        }
        yield updateFalseProject(oldProjectList);
        console.log('----------------------project sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------project sync START------------------------');
        let index = 1;
        const oldProjectList = yield (0, mongoDB_2.findByQuery)('projects', {
            repeat: true,
            repeatType: 'count',
        });
        let updateProjectResult;
        function updateCountProject(oldProjectList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateProjectQueries = [];
                let updatePosListQueries = [];
                for (const project of oldProjectList) {
                    const projectId = project._id.toString();
                    const project_hide = project.hide;
                    const posListByProjectId = yield (0, mongoDB_2.findByQuery)('projectOfStudent', { projectId: projectId });
                    const newProjectStatus = (0, statusDecision_1.decideNewProjectStatusColor)(posListByProjectId);
                    const newProjectBorderStatus = newProjectStatus == 'red' || newProjectStatus == 'yellow' ? 'yellow' : 'gray';
                    //과제 업데이트
                    updateProjectQueries.push({
                        updateOne: {
                            filter: { _id: project._id },
                            update: {
                                $set: {
                                    status: newProjectStatus,
                                    borderStatus: newProjectBorderStatus,
                                },
                                $unset: { newProjectAlert: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    //과제 내 숙제 업데이트(숨김여부)
                    updatePosListQueries.push({
                        updateMany: {
                            filter: { projectId: projectId },
                            update: {
                                $set: {
                                    project_hide: project_hide,
                                    updated: +new Date(),
                                },
                            },
                        },
                    });
                    console.log('[', index, ']', projectId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('projects', updateProjectQueries);
                const updatePosListResult = yield (0, mongoDB_1.bulkWrite)('projectOfStudent', updatePosListQueries);
            });
        }
        yield updateCountProject(oldProjectList);
        console.log('----------------------project sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
router.put('/sync/date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('----------------------project sync START------------------------');
        let index = 1;
        const oldProjectList = yield (0, mongoDB_2.findByQuery)('projects', {
            repeat: true,
            repeatType: 'date',
        });
        let updateProjectResult;
        function updateDateProject(oldProjectList) {
            return __awaiter(this, void 0, void 0, function* () {
                let updateProjectQueries = [];
                let updatePosListQueries = [];
                for (const project of oldProjectList) {
                    const projectId = project._id.toString();
                    const project_hide = project.hide;
                    const posListByProjectId = yield (0, mongoDB_2.findByQuery)('projectOfStudent', { projectId: projectId });
                    const newProjectStatus = (0, statusDecision_1.decideNewProjectStatusColor)(posListByProjectId);
                    const newProjectBorderStatus = (0, statusDecision_1.decideNewProjectBorderColor)(posListByProjectId);
                    //과제 업데이트
                    updateProjectQueries.push({
                        updateOne: {
                            filter: { _id: project._id },
                            update: {
                                $set: {
                                    status: newProjectStatus,
                                    borderStatus: newProjectBorderStatus,
                                },
                                $unset: { newProjectAlert: '' },
                                $rename: { timestamp: 'created', lastUpdate: 'updated' },
                            },
                        },
                    });
                    //과제 내 숙제 업데이트(숨김여부)
                    updatePosListQueries.push({
                        updateMany: {
                            filter: { projectId: projectId },
                            update: {
                                $set: {
                                    project_hide: project_hide,
                                    updated: +new Date(),
                                },
                            },
                        },
                    });
                    console.log('[', index, ']', projectId);
                    index++;
                }
                updateProjectResult = yield (0, mongoDB_1.bulkWrite)('projects', updateProjectQueries);
                const updatePosListResult = yield (0, mongoDB_1.bulkWrite)('projectOfStudent', updatePosListQueries);
            });
        }
        yield updateDateProject(oldProjectList);
        console.log('----------------------project sync END------------------------');
        return res.json(updateProjectResult);
    }
    catch (e) {
        console.log('[error]', e);
        res.json(false);
    }
}));
exports.default = router;
//# sourceMappingURL=projects.js.map