module.exports = {
  apps: [
    {
      name: 'freebucks-backend',
      script: 'npm',
      args: 'start',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
      merge_logs: true
    },
    {
      name: 'freebucks-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork', // Next.js typically runs better in fork mode for standard setups
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/frontend-error.log',
      out_file: 'logs/frontend-out.log',
      merge_logs: true
    }
  ]
};
