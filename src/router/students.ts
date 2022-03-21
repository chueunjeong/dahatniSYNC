import {
  bulkWrite,
  bulkWrite1000BatchInsert,
  bulkWrite1000BatchUpdateOne,
  findOne,
  insertOne,
} from './../database/mongoDB';
import { ObjectId } from 'mongodb';
import { StudentProject, StudentBadge } from './../common/class';
import { decideNewProjectStatusColor } from './../common/statusDecision';
import express from 'express';
import { aggregate, findByQuery } from '../database/mongoDB';

const router = express.Router();
router.put('/sync', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------student sync START------------------------');
    const oldStudentList: any = await findByQuery('students', {
      timestamp: { $exists: true },
      //code: 'w6LWgR8JW',
    });
    const oldStudentNum = oldStudentList.length;
    let updateStudentResult: any;
    let index: number = 1;
    async function updateStudent(oldStudentList: any[]) {
      let updateStudentQueries = [];
      let insertStudentBadgeQueries = [];

      for (const student of oldStudentList) {
        const studentCode: string = student.code;
        let studentStatusInfo: string[] = new Array(2);

        /*****************************status************************************** */
        const posListByStudentCode: any = await findByQuery('projectOfStudent', {
          code: studentCode,
          hide: false,
          project_hide: false,
        });
        const unconfirmNosByStudentCode: any = await findByQuery('noticeOfStudents', {
          code: studentCode,
          confirm: false,
          hide: false,
        });

        const studentProjectStatus: string = decideNewProjectStatusColor(posListByStudentCode);
        //과제 제출한 것이 있을 경우
        if (studentProjectStatus == 'red') {
          const blankPosList: StudentProject[] = posListByStudentCode.filter((pos: StudentProject) => pos.state == '');
          //아직 안한 과제와 아직 확인 안한 알림장이 없을 경우
          if (blankPosList.length === 0 && unconfirmNosByStudentCode.length === 0) studentStatusInfo = ['red', 'gray'];
          else studentStatusInfo = ['red', 'yellow'];
        }
        //과제 제출하지 않은 것이 있을 경우
        if (studentProjectStatus == 'yellow') {
          studentStatusInfo = ['yellow', 'yellow'];
        }
        //모든 과제가 완료되었을 경우
        if (studentProjectStatus == 'gray') {
          if (unconfirmNosByStudentCode.length === 0) {
            const uncheckCosListByStudentCode: any = await findByQuery('checklistOfStudent', {
              code: studentCode,
              hide: false,
              state: '',
            });
            if (unconfirmNosByStudentCode.length === 0) studentStatusInfo = ['gray', 'gray'];
            else studentStatusInfo = ['green', 'gray'];
          } else studentStatusInfo = ['yellow', 'yellow'];
        }
        /*****************************cookies************************************** */
        //학생들이 해당 과제에 대해 받은 쿠키 조회
        const cookiesNumByStudentCode: any = await aggregate('projectOfStudent', [
          {
            $match: {
              code: studentCode,
            },
          },
          {
            $group: {
              _id: '$code',
              cookiesNum: {
                $sum: '$cookie',
              },
            },
          },
        ]);

        const studentCookies: number = cookiesNumByStudentCode.length === 0 ? 0 : cookiesNumByStudentCode[0].cookiesNum;
        /*****************************badge************************************** */
        const studentBadge: any = await findOne('badges_student', { code: studentCode });

        if (studentBadge == null) {
          insertStudentBadgeQueries.push({
            insertOne: { document: new StudentBadge(student.classId, student.userId, studentCode) },
          });
        }

        updateStudentQueries.push({
          updateOne: {
            filter: { code: studentCode },
            update: {
              $set: {
                status: studentStatusInfo[0],
                iamdoneStatus: studentStatusInfo[1],
                cookie: studentCookies,
              },
              $unset: { checked: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 === 0) {
          console.log('[', index, '/', oldStudentNum, ']', studentCode);
        }
        index++;
      }

      updateStudentResult = await bulkWrite('students', updateStudentQueries);
      console.log('-----------------------------------------student update complete');
      console.log(updateStudentResult);
      if (insertStudentBadgeQueries.length !== 0) {
        const insertStudentBadgeListResult = await bulkWrite('badges_student', insertStudentBadgeQueries);
        console.log('-----------------------------------------student badge insert complete');
        console.log(insertStudentBadgeListResult);
      }
    }

    await updateStudent(oldStudentList);
    console.log('----------------------student sync END------------------------');
    return res.json(updateStudentResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});
export default router;
