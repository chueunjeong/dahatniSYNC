import { ObjectId } from 'mongodb';
import express from 'express';
import { aggregate, deleteMany, updateMany } from '../database/mongoDB';

const router = express.Router();

router.delete('/not-exist', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------nos delete START[4]------------------------');
    const nosList: any = await aggregate('noticeOfStudents', [
      {
        $addFields: {
          fk: { $toObjectId: '$noticeId' },
        },
      },

      {
        $lookup: {
          from: 'noticeOfTeachers',
          localField: 'fk',
          foreignField: '_id',
          as: 'noticeInfo',
        },
      },
      { $match: { noticeInfo: [] } },
    ]);
    let nosObjectIdList: ObjectId[] = [];
    nosList.map((nos: any) => nosObjectIdList.push(nos._id));
    const deleteNosResult: any = await deleteMany('noticeOfStudents', { _id: { $in: nosObjectIdList } });
    console.log('----------------------nos delete END[4]------------------------');
    return res.json(deleteNosResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/checked', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------nos sync START[5]------------------------');
    const updateNosSync: any = await updateMany(
      'noticeOfStudents',
      { noticeChecked: true },
      {
        $set: { hide: false },
        $unset: { noticeChecked: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------nos sync END[5]------------------------');
    return res.json(updateNosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/unchecked', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------nos sync START[6]------------------------');
    const updateNosSync: any = await updateMany(
      'noticeOfStudents',
      { noticeChecked: false },
      {
        $set: { hide: true },
        $unset: { noticeChecked: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------nos sync END[6]------------------------');
    return res.json(updateNosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});
export default router;
