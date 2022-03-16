import express from 'express';
import http from 'http';
import checklist from './router/checklist';

//라우터 가져오기
import checklistOfStudent from './router/checklistOfStudent';
import classes from './router/classes';
import noticeOfStudent from './router/noticeOfStudent';
import noticeOfTeacher from './router/noticeOfTeacher';
import projectOfStudent from './router/projectOfStudent';
import projects from './router/projects';
import students from './router/students';

const Restful = (PORT: number): void => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  app.use('/cos', checklistOfStudent); //[학생 체크리스트]와 관련된 라우터
  app.use('/checklist', checklist); //[체크리스트]와 관련된 라우터
  app.use('/nos', noticeOfStudent); //[학생 알림장]과 관련된 라우터
  app.use('/not', noticeOfTeacher); //[알림장]과 관련된 라우터
  app.use('/pos', projectOfStudent); //[학생에게 발급한 과제(숙제)]와 관련된 라우터
  app.use('/projects', projects); //[과제]와 관련된 라우터
  app.use('/students', students); //[학생]과 관련된 라우터
  app.use('/classes', classes); //[학급]과 관련된 라우터

  server.listen(PORT, () => {
    console.log(`Restful Server Running on ${PORT} port. `);
    console.log('----------------------------------------------------------');
    console.log(`Time: ${new Date().toString()}`);
    console.log('----------------------------------------------------------');
  });
};

export default Restful;
