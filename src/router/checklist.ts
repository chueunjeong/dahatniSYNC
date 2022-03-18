import { ObjectId } from 'mongodb';
import { bulkWrite, findByQuery } from './../database/mongoDB';
import express from 'express';

const router = express.Router();

router.put('/sync', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------checklist sync START------------------------');
    let index = 1;
    const oldChecklist: any = await findByQuery('checklist', {
      status: { $exists: false },
    });
    let updateChecklistResult: any;
    async function updateChecklist(oldChecklist: any[]) {
      let updateChecklistQueries = [];
      for (const checklist of oldChecklist) {
        const checklistId: string = checklist._id.toString();
        let newChecklistColor: string;
        //체크되지 않은 학생 체크리스트 목록
        const uncheckCosByChecklistId: any = await findByQuery('checklistOfStudent', {
          checklistId: checklistId,
          state: '',
          hide: false,
        });
        //체크리스트 상태 선택
        if (uncheckCosByChecklistId.length === 0) newChecklistColor = 'gray';
        else newChecklistColor = 'green';

        updateChecklistQueries.push({
          updateOne: {
            filter: { _id: new ObjectId(checklistId) },
            update: {
              $set: { status: newChecklistColor },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        console.log('[', index, '/', oldChecklist.length, ']', checklistId);
        index++;
      }

      updateChecklistResult = await bulkWrite('checklist', updateChecklistQueries);
    }

    await updateChecklist(oldChecklist);
    console.log('----------------------checklist sync END------------------------');
    return res.json(updateChecklistResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

export default router;
