module.exports = {
  apps : [{
    name: "next-app",
    script: "npm",
    args: "start",
    watch: true,
    env: {
      NODE_ENV: "production",
    }
  }]
};
