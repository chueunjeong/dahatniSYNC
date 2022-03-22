import { updateMany } from '../database/mongoDB';
import express from 'express';

const router = express.Router();

router.put('/sync/checked', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------cos sync START[1]------------------------');
    const updateCosSync: any = await updateMany(
      'checklistOfStudent',
      { checked: true },
      {
        $set: { hide: false },
        $unset: { checked: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------cos sync END[1]------------------------');
    return res.json(updateCosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/unchecked', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------cos sync START[2]------------------------');
    const updateCosSync: any = await updateMany(
      'checklistOfStudent',
      { checked: false },
      {
        $set: { hide: true },
        $unset: { checked: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------cos sync END[2]------------------------');
    return res.json(updateCosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

export default router;
