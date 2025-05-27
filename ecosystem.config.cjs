module.exports = {
  apps: [
    {
      name: 'teapot-tracker',
      script: 'npm',
      args:   'run start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      },
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 10000
    }
  ]
};
