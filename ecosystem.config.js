module.exports = {
  apps: [
    {
      name: "sailun",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      interpreter: "node",
      interpreter_args: "--env-file=.env",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
