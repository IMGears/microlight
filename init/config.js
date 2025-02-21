const config = {
  tasks: [
    // "../stories/**/*.mdx",
    // "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/tasks/**/*.task.@(js|ts)", // task
    "../src/tasks/**/*.md", // docs
  ],
  folder_file:['ml.js','ml.folder.js','microlight.folder.js'],
  enable_cron:true,
  enable_tasks:true,
};
export default config;
