const PROXY_CONFIG = [
    {
        context: "/api",
        target: "https://localhost:8080",
        secure: false
    },
    {
        context: "/ws",
        target: "wss://localhost:8080",
        secure: false,
        ws: true
    }
];

module.exports = PROXY_CONFIG;
