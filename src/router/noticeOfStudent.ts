import express from 'express';
import { updateMany } from '../database/mongoDB';

const router = express.Router();

router.put('/sync/checked', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------nos sync START------------------------');
    const updateNosSync: any = await updateMany(
      'noticeOfStudents',
      { noticeChecked: true },
      {
        $set: { hide: false },
        $unset: { noticeChecked: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------nos sync END------------------------');
    return res.json(updateNosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/unchecked', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------nos sync START------------------------');
    const updateNosSync: any = await updateMany(
      'noticeOfStudents',
      { noticeChecked: false },
      {
        $set: { hide: true },
        $unset: { noticeChecked: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------nos sync END------------------------');
    return res.json(updateNosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});
export default router;
