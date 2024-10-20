module.exports = {
    apps: [
        {
            name: "Danel Gold",
            script: "dist/main.js", // Point to the compiled JavaScript file
            watch: ["src"],          // Watch your TypeScript source files
            ignore_watch: ["node_modules", "dist"], // Ignore the build folder
            watch_delay: 1000,       // Wait 1 second after changes
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            // Run the tsc command before restarting the app
            // It uses pre-start hooks to build TypeScript before running the app
            exec_interpreter: "bash",
            interpreter_args: "-c 'npm run build && pm2 start dist/main.js'",

            // interpreter_args: "-c 'npm run build && node dist/index.js'",
        },
    ],
};
