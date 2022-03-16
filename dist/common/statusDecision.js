"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideNewClassStatusColor = exports.decideNewProjectBorderColor = exports.decideNewProjectStatusColor = void 0;
//과제 상태(숙제 결정)
const decideNewProjectStatusColor = (posListByProjectId) => {
    let newProjectStatusColor = '';
    const checkPosListByProjectId = posListByProjectId.filter((pos) => pos.state == 'check');
    if (checkPosListByProjectId.length === 0) {
        const blankPosListByProjectId = posListByProjectId.filter((pos) => pos.state == '');
        if (blankPosListByProjectId.length === 0)
            newProjectStatusColor = 'gray';
        else
            newProjectStatusColor = 'yellow';
    }
    else
        newProjectStatusColor = 'red';
    return newProjectStatusColor;
};
exports.decideNewProjectStatusColor = decideNewProjectStatusColor;
//과제 보더 상태(숙제 보더 결정)
const decideNewProjectBorderColor = (posListByProjectId) => {
    let newProjectBorderColor = '';
    const yellowPosListByProjectId = posListByProjectId.filter((pos) => pos.borderState == 'yellow');
    if (yellowPosListByProjectId.length === 0)
        newProjectBorderColor = 'gray';
    else
        newProjectBorderColor = 'yellow';
    return newProjectBorderColor;
};
exports.decideNewProjectBorderColor = decideNewProjectBorderColor;
//학급 상태(학생 결정)
const decideNewClassStatusColor = (studentListByClassId) => {
    let newClassStatusColor = '';
    const redStudentListByClassId = studentListByClassId.filter((student) => student.status == 'red');
    if (redStudentListByClassId.length === 0) {
        const yellowStudentListByClassId = studentListByClassId.filter((student) => student.status == 'yellow');
        if (yellowStudentListByClassId.length === 0) {
            const greenStudentListByClassId = studentListByClassId.filter((student) => student.status == 'green');
            if (greenStudentListByClassId.length === 0)
                newClassStatusColor = 'gray';
            else
                newClassStatusColor = 'green';
        }
        else
            newClassStatusColor = 'yellow';
    }
    else
        newClassStatusColor = 'red';
    return newClassStatusColor;
};
exports.decideNewClassStatusColor = decideNewClassStatusColor;
//# sourceMappingURL=statusDecision.js.map