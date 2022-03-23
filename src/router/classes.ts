import { ObjectId } from 'mongodb';
import express from 'express';
import { ClassBadge } from '../common/class';
import { decideNewClassStatusColor } from '../common/statusDecision';
import { bulkWrite, findByQuery, findOne } from '../database/mongoDB';
const router = express.Router();

router.put('/sync/null', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------class sync START[19]------------------------');
    let index = 1;
    const oldClassList: any = await findByQuery('class', {
      cookieHidden: { $exists: false },
    });
    const allClassCase: number = oldClassList.length;

    let updateProjectResult: any;
    async function updateClass(oldClassList: any[]) {
      let updateClassQueries = [];
      let insertBadgeQueries = [];
      for (const classInfo of oldClassList) {
        const classId: string = classInfo._id.toString();
        const userId: string = classInfo.userId;
        let classCookies: number = 0;
        /*****************************status************************************** */
        const studentListByClassId: any = await findByQuery('students', {
          classId: classId,
        });

        const newClassStatus: string = decideNewClassStatusColor(studentListByClassId);
        /*****************************cookie************************************** */
        if (studentListByClassId.length !== 0) {
          studentListByClassId.map((student: any) => (classCookies += student.cookie));
        }
        /*****************************badge************************************** */
        const badge: any = await findOne('badges_teacher', { classId: classId });

        if (badge == null) {
          insertBadgeQueries.push({ insertOne: { document: new ClassBadge(classId, userId) } });
        }

        updateClassQueries.push({
          updateOne: {
            filter: { _id: new ObjectId(classId) },
            update: {
              $set: {
                status: newClassStatus,
                cookieHidden: true,
                targetAction: '',
                targetCookies: '',
                cookies: classCookies,
              },
              $unset: { sort: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 == 0) console.log('[', index, '/', allClassCase, ']', ']', classId);
        index++;
      }

      updateProjectResult = await bulkWrite('class', updateClassQueries);
      if (insertBadgeQueries.length !== 0) {
        const insertBadgeListResult = await bulkWrite('badges_teacher', insertBadgeQueries);
      }
    }
    await updateClass(oldClassList);

    console.log('----------------------class sync END[19]------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/true', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------class sync START[20]------------------------');
    let index = 1;
    const oldClassList: any = await findByQuery('class', {
      cookieHidden: 'true',
    });
    const allClassCase: number = oldClassList.length;
    let updateProjectResult: any;
    async function updateClass(oldClassList: any[]) {
      let updateClassQueries = [];
      let insertBadgeQueries = [];
      for (const classInfo of oldClassList) {
        const classId: string = classInfo._id.toString();
        const userId: string = classInfo.userId;
        let classCookies: number = 0;
        /*****************************status************************************** */
        const studentListByClassId: any = await findByQuery('students', {
          classId: classId,
        });

        const newClassStatus: string = decideNewClassStatusColor(studentListByClassId);
        /*****************************cookie************************************** */
        if (studentListByClassId.length !== 0) {
          studentListByClassId.map((student: any) => (classCookies += student.cookie));
        }
        /*****************************badge************************************** */
        const badge: any = await findOne('badges_teacher', { classId: classId });

        if (badge == null) {
          insertBadgeQueries.push({ insertOne: { document: new ClassBadge(classId, userId) } });
        }

        updateClassQueries.push({
          updateOne: {
            filter: { _id: new ObjectId(classId) },
            update: {
              $set: {
                status: newClassStatus,
                cookieHidden: true,
                cookies: classCookies,
              },
              $unset: { sort: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 == 0) console.log('[', index, '/', allClassCase, ']', ']', classId);
        index++;
      }

      updateProjectResult = await bulkWrite('class', updateClassQueries);
      const insertBadgeListResult = await bulkWrite('badges_teacher', insertBadgeQueries);
    }
    await updateClass(oldClassList);

    console.log('----------------------class sync END[20]------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/false', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------class sync START[21]------------------------');
    let index = 1;
    const oldClassList: any = await findByQuery('class', {
      cookieHidden: 'false',
    });
    const allClassCase: number = oldClassList.length;
    let updateProjectResult: any;
    async function updateClass(oldClassList: any[]) {
      let updateClassQueries = [];
      let insertBadgeQueries = [];
      for (const classInfo of oldClassList) {
        const classId: string = classInfo._id.toString();
        const userId: string = classInfo.userId;
        let classCookies: number = 0;
        /*****************************status************************************** */
        const studentListByClassId: any = await findByQuery('students', {
          classId: classId,
        });

        const newClassStatus: string = decideNewClassStatusColor(studentListByClassId);
        /*****************************cookie************************************** */
        if (studentListByClassId.length !== 0) {
          studentListByClassId.map((student: any) => (classCookies += student.cookie));
        }
        /*****************************badge************************************** */
        const badge: any = await findOne('badges_teacher', { classId: classId });

        if (badge == null) {
          insertBadgeQueries.push({ insertOne: { document: new ClassBadge(classId, userId) } });
        }

        updateClassQueries.push({
          updateOne: {
            filter: { _id: new ObjectId(classId) },
            update: {
              $set: {
                status: newClassStatus,
                cookieHidden: false,
                cookies: classCookies,
              },
              $unset: { sort: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 == 0) console.log('[', index, '/', allClassCase, ']', ']', classId);
        index++;
      }

      updateProjectResult = await bulkWrite('class', updateClassQueries);
      const insertBadgeListResult = await bulkWrite('badges_teacher', insertBadgeQueries);
    }
    await updateClass(oldClassList);

    console.log('----------------------class sync END[21]------------------------');

    console.timeEnd('TOTAL_ELAPSED_TIME');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});
export default router;
