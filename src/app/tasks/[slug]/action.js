"use server";

import getTaskDetails from "@/lib/getTaskDetails";

export async function executeTask({formData, task}) {
  

  let params = {
    slug: task.slug
  }
  let taskDef = await getTaskDetails({params})
  let ml = {};
  await taskDef.fn(ml,formData);
  // console.log(task);
  return { success: true };
}