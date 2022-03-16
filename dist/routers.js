"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const checklist_1 = __importDefault(require("./router/checklist"));
//라우터 가져오기
const checklistOfStudent_1 = __importDefault(require("./router/checklistOfStudent"));
const noticeOfStudent_1 = __importDefault(require("./router/noticeOfStudent"));
const noticeOfTeacher_1 = __importDefault(require("./router/noticeOfTeacher"));
const projectOfStudent_1 = __importDefault(require("./router/projectOfStudent"));
const projects_1 = __importDefault(require("./router/projects"));
const students_1 = __importDefault(require("./router/students"));
const Restful = (PORT) => {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    app.use(express_1.default.json());
    app.use("/cos", checklistOfStudent_1.default); //[학생 체크리스트]와 관련된 라우터
    app.use("/checklist", checklist_1.default); //[체크리스트]와 관련된 라우터
    app.use("/nos", noticeOfStudent_1.default); //[학생 알림장]과 관련된 라우터
    app.use("/not", noticeOfTeacher_1.default); //[알림장]과 관련된 라우터
    app.use("/pos", projectOfStudent_1.default); //[학생에게 발급한 과제(숙제)]와 관련된 라우터
    app.use("/projects", projects_1.default); //[과제]와 관련된 라우터
    app.use("/students", students_1.default); //[학생]과 관련된 라우터
    server.listen(PORT, () => {
        console.log(`Restful Server Running on ${PORT} port. `);
        console.log("----------------------------------------------------------");
        console.log(`Time: ${new Date().toString()}`);
        console.log("----------------------------------------------------------");
    });
};
exports.default = Restful;
//# sourceMappingURL=routers.js.map