module.exports = {
  apps: [
    {
      name: "g-nest-frontend",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/g-nest/g-nest-frontend",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
