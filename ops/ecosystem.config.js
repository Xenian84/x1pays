module.exports = {
  apps: [
    {
      name: "x1pays-facilitator",
      script: "dist/index.js",
      cwd: "./packages/facilitator",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M"
    },
    {
      name: "x1pays-api",
      script: "dist/index.js",
      cwd: "./packages/api",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M"
    }
  ]
};
