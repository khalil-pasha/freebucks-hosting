module.exports = {
  apps: [
    {
      name: 'freebucks-frontend',
      cwd: '/var/www/freebucks-hosting',
      script: '.next/standalone/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
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
