export const importTaskModule = async (task_slug) => {
  switch (task_slug) {
    case "takes_time":
      return await import("@/tasks/1.intro/takes_time.task.js");
    case "scheduled":
      return await import("@/tasks/1.intro/scheduled.task.js");
    case "ml":
      return await import("@/tasks/1.intro/ml.task.js");
    case "hello_world":
      return await import("@/tasks/1.intro/hello_world2.task.js");
    case "takes_time2":
      return await import("@/tasks/1.intro/test/takes_time2.task.js");
    default:
      return { default: { name: "Library", description: "All executable tasks" } };
  }
};