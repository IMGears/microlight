import { executeTask } from '@/app/tasks/[slug]/action';

export async function POST(request, { params }) {
  try {
    // Extract the slug from the route parameters
    const { slug } = params;

    // Extract query parameters
    const url = new URL(request.url);

    // Create FormData-like object with the query parameters
    const formData = new FormData();
    for (const [key, value] of url.searchParams.entries()) {
      formData.append(key, value);
    }

    // Create task object using the dynamic slug
    const task = {
      slug: slug,
      // Add other required task properties here
    };

    // Execute the task using the same function
    const result = await executeTask({ formData, task });

    if (result.success) {
      return Response.json({
        success: true,
        runId: result.run.id,
        redirectUrl: `/tasks/${slug}/runs/${result.run.id}`
      });
    } else {
      return Response.json({
        success: false,
        error: 'Task execution failed'
      }, { status: 400 });
    }

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 