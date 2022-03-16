"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassBadge = exports.Badge = exports.StudentBadge = exports.RepeatData = exports.StudentProject = exports.StudentChecklist = void 0;
//학생 체크리스트
class StudentChecklist {
    constructor(classId, userId, code, checklistId) {
        this.classId = classId;
        this.userId = userId;
        this.code = code;
        this.checklistId = checklistId;
        this.hide = false;
        this.state = '';
        this.description = '';
        this.created = +new Date();
        this.updated = +new Date();
    }
}
exports.StudentChecklist = StudentChecklist;
//학생 과제
class StudentProject {
    //생성자
    constructor(classId, userId, projectId, code, repeat, repeatType = '', repeatData = [], borderState = '') {
        this.classId = classId;
        this.userId = userId;
        this.projectId = projectId;
        this.code = code;
        this.hide = false;
        this.project_hide = false;
        this.repeat = repeat;
        this.repeatType = repeatType;
        this.repeatData = repeatData;
        this.state = '';
        this.borderState = borderState;
        this.cookie = 0;
        this.score = '';
        this.reject = '';
        this.feedback = '';
        this.studentBody = '';
        this.fileUrls = [];
        this.project_hide = false;
        this.created = +new Date();
        this.updated = +new Date();
    }
}
exports.StudentProject = StudentProject;
//반복 과제
class RepeatData {
    //생성자
    constructor(open, alertDate = null) {
        this.open = open;
        this.reject = '';
        this.state = '';
        this.score = '';
        this.cookie = 0;
        this.feedback = '';
        this.studentBody = '';
        this.fileUrls = [];
        this.alertDate = alertDate;
        this.created = +new Date();
        this.updated = +new Date();
    }
}
exports.RepeatData = RepeatData;
//학생 뱃지
class StudentBadge {
    constructor(classId, userId, code) {
        this.classId = classId;
        this.userId = userId;
        this.code = code;
        const badges = new Array(6);
        badges.fill(false);
        this.badges = badges;
        this.created = +new Date();
        this.updated = +new Date();
    }
}
exports.StudentBadge = StudentBadge;
//뱃지
class Badge {
    constructor(imgUrl = '', title = '', type = '', manualTarget = '', autoTarget = 0, desc = '') {
        this.imgUrl = imgUrl;
        this.title = title;
        this.type = type;
        this.manualTarget = manualTarget;
        this.autoTarget = autoTarget;
        this.desc = desc;
        this.created = +new Date();
        this.updated = +new Date();
    }
    static ManualInstance(imgUrl, title, manualTarget, desc = '') {
        const newBadge = new Badge(imgUrl, title, 'manual', manualTarget, 0, desc);
        return newBadge;
    }
    static AutoInstance(imgUrl, title, autoTarget = 0, desc = '') {
        return new Badge(imgUrl, title, 'auto', '', autoTarget, desc);
    }
}
exports.Badge = Badge;
//학급 뱃지
class ClassBadge {
    constructor(classId, userId) {
        this.classId = classId;
        this.userId = userId;
        const badgeList = new Array(6);
        badgeList.fill(new Badge());
        this.badges = badgeList;
        this.created = +new Date();
        this.updated = +new Date();
    }
}
exports.ClassBadge = ClassBadge;
//# sourceMappingURL=class.js.map