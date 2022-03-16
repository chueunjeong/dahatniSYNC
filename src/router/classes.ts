import { ObjectId } from 'mongodb';
import express from 'express';
import { ClassBadge } from '../common/class';
import { decideNewClassStatusColor } from '../common/statusDecision';
import { bulkWrite, findByQuery, findOne } from '../database/mongoDB';
const router = express.Router();

router.put('/sync/null', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------class sync START------------------------');
    let index = 1;
    const oldClassList: any = await findByQuery('class', {
      cookieHidden: { $exists: false },
    });

    let updateProjectResult: any;
    async function updateClass(oldClassList: any[]) {
      let updateClassQueries = [];
      let insertBadgeQueries = [];
      for (const classInfo of oldClassList) {
        const classId: string = classInfo._id.toString();
        const userId: string = classInfo.userId;

        /*****************************status************************************** */
        const studentListByClassId: any = await findByQuery('projectOfStudent', {
          classId: classId,
        });

        const newClassStatus: string = decideNewClassStatusColor(studentListByClassId);

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
              },
              $unset: { sort: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 == 0) console.log('[', index, ']', classId);
        index++;
      }

      updateProjectResult = await bulkWrite('class', updateClassQueries);
      const insertBadgeListResult = await bulkWrite('badges_teacher', insertBadgeQueries);
    }
    await updateClass(oldClassList);

    console.log('----------------------class sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/true', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------class sync START------------------------');
    let index = 1;
    const oldClassList: any = await findByQuery('class', {
      cookieHidden: 'true',
    });

    let updateProjectResult: any;
    async function updateClass(oldClassList: any[]) {
      let updateClassQueries = [];
      let insertBadgeQueries = [];
      for (const classInfo of oldClassList) {
        const classId: string = classInfo._id.toString();
        const userId: string = classInfo.userId;

        /*****************************status************************************** */
        const studentListByClassId: any = await findByQuery('projectOfStudent', {
          classId: classId,
        });

        const newClassStatus: string = decideNewClassStatusColor(studentListByClassId);

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
              },
              $unset: { sort: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 == 0) console.log('[', index, ']', classId);
        index++;
      }

      updateProjectResult = await bulkWrite('class', updateClassQueries);
      const insertBadgeListResult = await bulkWrite('badges_teacher', insertBadgeQueries);
    }
    await updateClass(oldClassList);

    console.log('----------------------class sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/false', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------class sync START------------------------');
    let index = 1;
    const oldClassList: any = await findByQuery('class', {
      cookieHidden: 'false',
    });

    let updateProjectResult: any;
    async function updateClass(oldClassList: any[]) {
      let updateClassQueries = [];
      let insertBadgeQueries = [];
      for (const classInfo of oldClassList) {
        const classId: string = classInfo._id.toString();
        const userId: string = classInfo.userId;

        /*****************************status************************************** */
        const studentListByClassId: any = await findByQuery('projectOfStudent', {
          classId: classId,
        });

        const newClassStatus: string = decideNewClassStatusColor(studentListByClassId);

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
              },
              $unset: { sort: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 == 0) console.log('[', index, ']', classId);
        index++;
      }

      updateProjectResult = await bulkWrite('class', updateClassQueries);
      const insertBadgeListResult = await bulkWrite('badges_teacher', insertBadgeQueries);
    }
    await updateClass(oldClassList);

    console.log('----------------------class sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});
export default router;
