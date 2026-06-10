module.exports = {
  apps: [
    {
      name: 'freebucks-backend',
      script: '/var/www/freebucks-hosting/backend/dist/index.js',
      cwd: '/var/www/freebucks-hosting/backend',
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
      error_file: '/var/www/freebucks-hosting/backend/logs/backend-error.log',
      out_file: '/var/www/freebucks-hosting/backend/logs/backend-out.log',
      merge_logs: true
    },
    {
      name: 'freebucks-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/freebucks-hosting/frontend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/www/freebucks-hosting/frontend/logs/frontend-error.log',
      out_file: '/var/www/freebucks-hosting/frontend/logs/frontend-out.log',
      merge_logs: true
    }
  ]
};
