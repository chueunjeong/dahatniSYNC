import { bulkWrite, findByQuery, updateMany } from './../database/mongoDB';
import express from 'express';

const router = express.Router();
router.put('/sync', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------studentBadges sync START[18]------------------------');
    const oldStudentBadgeList: any = await findByQuery('badges_student', {
      timestamp: { $exists: true },
    });
    const oldStudentBadgeNum = oldStudentBadgeList.length;
    let updateStudentBagdeResult: any;
    let index: number = 1;
    async function updateStudentBadge(oldStudentBadgeList: any[]) {
      let updateStudentBadgeQueries: any[] = [];
      for (const studentBadge of oldStudentBadgeList) {
        const studentCode: string = studentBadge.code;
        let oldStudentBadgeInfo: string[] = studentBadge.badges;
        let newStudentBadgeInfo: boolean[] = new Array(6);

        oldStudentBadgeInfo.map(
          (value: string, index: number) => (newStudentBadgeInfo[index] = value == '0' ? false : true),
        );

        updateStudentBadgeQueries.push({
          updateOne: {
            filter: { code: studentCode },
            update: {
              $set: {
                badges: newStudentBadgeInfo,
              },

              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        if (index % 100 === 0) {
          console.log('[', index, '/', oldStudentBadgeNum, ']', studentCode);
        }
        index++;
      }
      updateStudentBagdeResult = await bulkWrite('badges_student', updateStudentBadgeQueries);
    }
    await updateStudentBadge(oldStudentBadgeList);
    console.log('----------------------studentBadges sync END[18]------------------------');
    return res.json(updateStudentBagdeResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});
export default router;
