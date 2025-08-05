/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react';
import ViewTask from '@/app/tasks/[slug]/ViewTask';  
import { executeTask } from '@/app/tasks/[slug]/action';
import '@testing-library/jest-dom';
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/app/tasks/[slug]/action', () => ({
  executeTask: jest.fn().mockResolvedValue({
    success: true,
    run: { id: '123' },
  }),
}));

describe('ViewTask Component', () => {
  const mockTask = {
    name: 'Sample Task',
    slug: 'sample-task',
    description: 'This is a description of the sample task',
    inputs: {
      input1: {
        name: "input1",
        label: "Input 1"
      },
      input2:{
        name: "input2",
        label: "Input 2"
      },
    },
    schedules: [
      {
        schedule: '0 12 * * *',
        description: 'Daily at noon',
        inputs: { input1: 'value1' },
        is_enabled: true,
      },
    ],
    runs: [
      {
        id: '1',
        updated_at: '2025-08-01T12:00:00Z',
        inputs: { input1: 'value1' },
        status: 'Completed',
        duration: 1000,
        triggered_by: 'user',
      },
    ],
    links: [
      { href: 'https://example.com', title: 'Example Link' },
    ],
  };

  test('renders ViewTask component without crashing', async () => {
    const { container } = render(<ViewTask task={mockTask} runs={mockTask.runs} params={{ slug: 'sample-task' }} searchParams={{}} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Execute task')).toBeInTheDocument();
    expect(screen.getByText('Schedules:')).toBeInTheDocument();
    const submitButton = screen.getByText('Execute task');
    fireEvent.click(submitButton)
  });

  // test('executes task and redirects on form submission', async () => {
  //   render(<ViewTask task={mockTask} runs={mockTask.runs} params={{ slug: 'sample-task' }} searchParams={{}} />);

  //   // Simulate form submission
  //   const submitButton = screen.getByRole('button', { name: /Execute task/i });
  //   console.log(submitButton)
  //   fireEvent.click(submitButton);

  //   // Assert that the executeTask function is called
  //   expect(executeTask).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       formData: expect.any(FormData),
  //       task: mockTask,
  //     })
  //   );

  //   // Assert that the page redirect happens
  //   expect(require('next/navigation').redirect).toHaveBeenCalledWith('/tasks/sample-task/runs/123');
  // });
});
