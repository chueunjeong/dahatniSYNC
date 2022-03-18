import { ObjectId } from 'mongodb';
import { RepeatData } from './../common/class';
import { bulkWrite, findByQuery } from './../database/mongoDB';
import express from 'express';
import { updateMany } from '../database/mongoDB';
import { StudentProject } from '../common/class';

const router = express.Router();

//repeat이 아예 없는 경우
router.put('/sync/null', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------pos sync START------------------------');
    const updatePosSync: any = await updateMany(
      'projectOfStudent',
      { repeat: { $exists: false } },
      {
        $set: {
          repeat: false,
          repeatType: '',
          repeatData: [],
          completeCount: 0,
        },
        $unset: { read: '' },
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------pos sync END------------------------');
    return res.json(updatePosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/false', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------pos sync START------------------------');
    const updatePosSync: any = await updateMany(
      'projectOfStudent',
      { repeat: false },
      {
        $rename: { timestamp: 'created', lastUpdate: 'updated' },
      },
    );
    console.log('----------------------pos sync END------------------------');
    return res.json(updatePosSync);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/count', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------pos sync START------------------------');
    let index = 1;
    const allCountPos: any = await findByQuery('projectOfStudent', {
      repeat: true,
      repeatType: 'count',
    });
    let updatePosResult: any;
    async function updateCountPos(allCountPos: any[]) {
      let updatePosQueries = [];
      for (const pos of allCountPos) {
        let oldRepeatData: any[] = pos.repeatData;
        let newRepeatData: RepeatData[] = new Array(oldRepeatData.length);

        oldRepeatData.map(
          (oldData: any, index: number) =>
            (newRepeatData[index] = oldData.created == undefined ? new RepeatData(oldData.open) : oldRepeatData[index]),
        );
        updatePosQueries.push({
          updateOne: {
            filter: { _id: pos._id },
            update: {
              $set: { repeatData: newRepeatData },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        if (index % 100 === 0) console.log('[', index, '/', allCountPos.length, ']', pos._id);
        index++;
      }

      updatePosResult = await bulkWrite('projectOfStudent', updatePosQueries);
    }
    await updateCountPos(allCountPos);
    console.log('----------------------pos sync END------------------------');
    return res.json(updatePosResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/date', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------pos sync START------------------------');
    let index = 1;
    const allDatePos: any = await findByQuery('projectOfStudent', {
      repeat: true,
      repeatType: 'date',
    });
    let updatePosResult: any;
    async function updateDatePos(allDatePos: any[]) {
      let updatePosQueries = [];
      for (const pos of allDatePos) {
        let oldRepeatData: any[] = pos.repeatData;
        let newRepeatData: RepeatData[] = new Array(oldRepeatData.length);

        oldRepeatData.map(
          (oldData: any, index: number) =>
            (newRepeatData[index] =
              oldData.created == undefined ? new RepeatData(oldData.open, oldData.alertDate) : oldRepeatData[index]),
        );
        updatePosQueries.push({
          updateOne: {
            filter: { _id: pos._id },
            update: {
              $set: { repeatData: newRepeatData },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        console.log('[', index, '/', allDatePos.length, ']', pos._id);
        index++;
      }

      updatePosResult = await bulkWrite('projectOfStudent', updatePosQueries);
    }
    await updateDatePos(allDatePos);
    console.log('----------------------pos sync END------------------------');
    return res.json(updatePosResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

export default router;
