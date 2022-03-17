import { ObjectId } from 'mongodb';
import { bulkWrite } from './../database/mongoDB';
import { decideNewProjectBorderColor, decideNewProjectStatusColor } from './../common/statusDecision';
import { findByQuery } from '../database/mongoDB';
import express from 'express';

const router = express.Router();

router.put('/sync/null', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------project sync START------------------------');
    let index = 1;
    const oldProjectList: any = await findByQuery('projects', {
      repeat: { $exists: false },
    });

    let updateProjectResult: any;
    async function updateNullProject(oldProjectList: any[]) {
      let updateProjectQueries = [];
      let updatePosListQueries = [];

      for (const project of oldProjectList) {
        const projectId: string = project._id.toString();
        const project_hide: boolean = project.hide;
        const posListByProjectId: any = await findByQuery('projectOfStudent', { projectId: projectId });
        const newProjectStatus: string = decideNewProjectStatusColor(posListByProjectId);
        //과제 업데이트
        updateProjectQueries.push({
          updateOne: {
            filter: { _id: project._id },
            update: {
              $set: {
                repeat: false,
                status: newProjectStatus,
                borderStatus: '',
                repeatType: '',
                repeatCount: 0,
              },
              $unset: { newProjectAlert: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        //과제 내 숙제 업데이트(숨김여부)
        updatePosListQueries.push({
          updateMany: {
            filter: { projectId: projectId },
            update: {
              $set: {
                project_hide: project_hide,
                updated: +new Date(),
              },
            },
          },
        });
        if (index % 100 === 0) console.log('[', index, ']', projectId);
        index++;
      }

      updateProjectResult = await bulkWrite('projects', updateProjectQueries);
      const updatePosListResult = await bulkWrite('projectOfStudent', updatePosListQueries);
    }
    await updateNullProject(oldProjectList);
    console.log('----------------------project sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/false', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------project sync START------------------------');
    let index = 1;
    const oldProjectList: any = await findByQuery('projects', {
      repeat: false,
    });
    let updateProjectResult: any;
    async function updateFalseProject(oldProjectList: any[]) {
      let updateProjectQueries = [];
      let updatePosListQueries = [];

      for (const project of oldProjectList) {
        const projectId: string = project._id.toString();
        const project_hide: boolean = project.hide;
        const posListByProjectId: any = await findByQuery('projectOfStudent', { projectId: projectId });
        const newProjectStatus: string = decideNewProjectStatusColor(posListByProjectId);
        //과제 업데이트
        updateProjectQueries.push({
          updateOne: {
            filter: { _id: project._id },
            update: {
              $set: {
                status: newProjectStatus,
                borderStatus: '',
                repeatCount: 0,
              },
              $unset: { newProjectAlert: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        //과제 내 숙제 업데이트(숨김여부)
        updatePosListQueries.push({
          updateMany: {
            filter: { projectId: projectId },
            update: {
              $set: {
                project_hide: project_hide,
                updated: +new Date(),
              },
            },
          },
        });

        if (index % 100 === 0) console.log('[', index, ']', projectId);
        index++;
      }

      updateProjectResult = await bulkWrite('projects', updateProjectQueries);
      const updatePosListResult = await bulkWrite('projectOfStudent', updatePosListQueries);
    }

    await updateFalseProject(oldProjectList);
    console.log('----------------------project sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/count', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------project sync START------------------------');
    let index = 1;
    const oldProjectList: any = await findByQuery('projects', {
      repeat: true,
      repeatType: 'count',
    });
    let updateProjectResult: any;

    async function updateCountProject(oldProjectList: any[]) {
      let updateProjectQueries = [];
      let updatePosListQueries = [];

      for (const project of oldProjectList) {
        const projectId: string = project._id.toString();
        const project_hide: boolean = project.hide;
        const posListByProjectId: any = await findByQuery('projectOfStudent', { projectId: projectId });
        const newProjectStatus: string = decideNewProjectStatusColor(posListByProjectId);

        const newProjectBorderStatus: string =
          newProjectStatus == 'red' || newProjectStatus == 'yellow' ? 'yellow' : 'gray';
        //과제 업데이트
        updateProjectQueries.push({
          updateOne: {
            filter: { _id: project._id },
            update: {
              $set: {
                status: newProjectStatus,
                borderStatus: newProjectBorderStatus,
              },
              $unset: { newProjectAlert: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        //과제 내 숙제 업데이트(숨김여부)
        updatePosListQueries.push({
          updateMany: {
            filter: { projectId: projectId },
            update: {
              $set: {
                project_hide: project_hide,
                updated: +new Date(),
              },
            },
          },
        });

        if (index % 100 === 0) console.log('[', index, ']', projectId);
        index++;
      }

      updateProjectResult = await bulkWrite('projects', updateProjectQueries);
      const updatePosListResult = await bulkWrite('projectOfStudent', updatePosListQueries);
    }

    await updateCountProject(oldProjectList);
    console.log('----------------------project sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

router.put('/sync/date', async (req: express.Request, res: express.Response) => {
  try {
    console.log('----------------------project sync START------------------------');
    let index = 1;
    const oldProjectList: any = await findByQuery('projects', {
      repeat: true,
      repeatType: 'date',
    });
    let updateProjectResult: any;

    async function updateDateProject(oldProjectList: any[]) {
      let updateProjectQueries = [];
      let updatePosListQueries = [];

      for (const project of oldProjectList) {
        const projectId: string = project._id.toString();
        const project_hide: boolean = project.hide;
        const posListByProjectId: any = await findByQuery('projectOfStudent', { projectId: projectId });
        const newProjectStatus: string = decideNewProjectStatusColor(posListByProjectId);
        const newProjectBorderStatus: string = decideNewProjectBorderColor(posListByProjectId);
        //과제 업데이트
        updateProjectQueries.push({
          updateOne: {
            filter: { _id: project._id },
            update: {
              $set: {
                status: newProjectStatus,
                borderStatus: newProjectBorderStatus,
              },
              $unset: { newProjectAlert: '' },
              $rename: { timestamp: 'created', lastUpdate: 'updated' },
            },
          },
        });
        //과제 내 숙제 업데이트(숨김여부)
        updatePosListQueries.push({
          updateMany: {
            filter: { projectId: projectId },
            update: {
              $set: {
                project_hide: project_hide,
                updated: +new Date(),
              },
            },
          },
        });

        if (index % 100 === 0) console.log('[', index, ']', projectId);
        index++;
      }

      updateProjectResult = await bulkWrite('projects', updateProjectQueries);
      const updatePosListResult = await bulkWrite('projectOfStudent', updatePosListQueries);
    }
    await updateDateProject(oldProjectList);
    console.log('----------------------project sync END------------------------');
    return res.json(updateProjectResult);
  } catch (e) {
    console.log('[error]', e);
    res.json(false);
  }
});

export default router;
