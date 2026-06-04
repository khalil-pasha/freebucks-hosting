"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const validateEnv = () => {
    const required = [
        'DATABASE_URL',
        'JWT_SECRET',
        'REDIS_URL',
        'FRONTEND_URL'
    ];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error(`FATAL ERROR: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
    // If pterodactyl keys are present, validate all of them are present
    const pteroKeys = [
        'PTERODACTYL_PANEL_URL',
        'PTERODACTYL_API_KEY',
        'PTERODACTYL_CLIENT_KEY'
    ];
    const hasAnyPteroKey = pteroKeys.some(key => !!process.env[key]);
    if (hasAnyPteroKey) {
        const missingPtero = pteroKeys.filter(key => !process.env[key]);
        if (missingPtero.length > 0) {
            console.error(`FATAL ERROR: Pterodactyl mode is enabled but missing variables: ${missingPtero.join(', ')}`);
            process.exit(1);
        }
        console.log('Environment Validation: Pterodactyl mode ENABLED.');
    }
    else {
        console.log('Environment Validation: Simulation mode ENABLED.');
    }
    console.log('Environment Validation: OK.');
};
exports.validateEnv = validateEnv;
