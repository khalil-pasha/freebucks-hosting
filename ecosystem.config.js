module.exports = {
  apps: [
    {
      name: 'freebucks-frontend',
      cwd: '/var/www/freebucks-hosting',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'freebucks-backend',
      cwd: '/var/www/freebucks-hosting/backend',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
