import microlightDB from '@/database/microlight';
import executeRun from '@//lib/executeRun';
import { revalidatePath } from 'next/cache';
import { executeTask } from '@//app/tasks/[slug]/action';
import async from 'async'

jest.mock('@//database/microlight', () => ({
  Runs: {
    create: jest.fn(),
  },
}));
jest.mock('@/lib/executeRun', () => jest.fn());
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('executeTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    microlightDB.Runs.create.mockResolvedValue({
    toJSON: () => ({
      id: 1,
      task: 'test-task',
      logs: {},
      inputs: { file: 'mocked-file' },
      triggered_by: 'user',
      status: 'pending',
    }),
  });
    if (async.auto.mockImplementation) {
    async.auto.mockImplementation(async (workflow) => {
      const createRun = await workflow.createRun();
      const startRun = await workflow.startRun({ createRun });
      return { createRun, startRun };
    });
  }
  });

  it('should create a run and trigger executeRun', async () => {
    const fileObj = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', fileObj);
    const task = { slug: 'test-task' };

    const result = await executeTask({ formData, task });

    await new Promise(process.nextTick);
    console.log(result)
    expect(result.success).toBe(true);
    expect(result.run).toBeDefined();
    expect(result.run.inputs.file).toBeInstanceOf(File);  // This insures the file inside the json is a File object
    expect(microlightDB.Runs.create).toHaveBeenCalled();
    expect(executeRun).toHaveBeenCalledWith(expect.objectContaining({ task: 'test-task' }));
    expect(revalidatePath).toHaveBeenCalledWith('/tasks/test-task');
  });

});