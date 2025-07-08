import microlightDB from '@/database/microlight';
import executeRun from '@//lib/executeRun';
import { revalidatePath } from 'next/cache';
import async from 'async';
import { executeTask } from '@//app/tasks/[slug]/action';

jest.mock('@//database/microlight', () => ({
  Runs: {
    create: jest.fn(),
  },
}));
jest.mock('@//lib/executeRun', () => jest.fn());
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
jest.mock('async', () => ({
  auto: jest.fn(),
}));


describe('executeTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a run and trigger executeRun', async () => {
    const fileObj = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', fileObj);
    // Simulate a file object in formData
    const runObject = {
      toJSON: () => ({
      id: 1,
      task: 'test-task',
      logs: {},
      inputs: { file: fileObj },
      triggered_by: 'user',
      status: 'pending',
      }),
    };
    microlightDB.Runs.create.mockResolvedValue(runObject);

    // Simulate async.auto workflow
    async.auto.mockImplementation(async (workflow) => {
      const createRun = await workflow.createRun();
      await workflow.startRun({ createRun });
      return { createRun };
    });

    const task = { slug: 'test-task' };

    const result = await executeTask({ formData, task });

    expect(result.success).toBe(true);
    expect(result.run).toBeDefined();
    expect(microlightDB.Runs.create).toHaveBeenCalled();
    expect(executeRun).toHaveBeenCalledWith(expect.objectContaining({ task: 'test-task' }));
    expect(revalidatePath).toHaveBeenCalledWith('/tasks/test-task');
  });

  // it('should handle errors and return failure', async () => {
  //   async.auto.mockRejectedValue(new Error('DB error'));
  //   const result = await executeTask({ formData: {}, task: { slug: 'test-task' } });
  //   expect(result.success).toBe(false);
  //   expect(result.error).toBeDefined();
  // });
});