import express from 'express';
import { ObjectId } from 'mongodb';
import { findByQuery, bulkWrite } from '../database/mongoDB';

const router = express.Router();

router.put('/sync', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------not sync START------------------------');
    let index = 1;
    const oldNotList: any = await findByQuery('noticeOfTeachers', {
      status: { $exists: false },
    });
    let updateNotResult: any;
    async function updateNot(oldNotList: any[]) {
      let updateNotQueries = [];
      for (const not of oldNotList) {
        const noticeId: string = not._id.toString();
        let newNotColor: string;
        //확인하지 않은 알림장
        const unconfirmNosListByNoticeId: any = await findByQuery('noticeOfStudents', {
          noticeId: noticeId,
          confirm: false,
          hide: false,
        });
        //체크리스트 상태 선택
        if (unconfirmNosListByNoticeId.length === 0) newNotColor = 'gray';
        else newNotColor = 'yellow';

        updateNotQueries.push({
          updateOne: {
            filter: { _id: new ObjectId(noticeId) },
            update: {
              $set: { status: newNotColor },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });

        if (index % 100 === 0) console.log('[', index, ']', noticeId);
        index++;
      }

      updateNotResult = await bulkWrite('noticeOfTeachers', updateNotQueries);
    }

    await updateNot(oldNotList);
    console.log('----------------------not sync END------------------------');
    return res.json(updateNotResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

export default router;
