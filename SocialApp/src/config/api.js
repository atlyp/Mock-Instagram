const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !configuredApiUrl) {
    throw new Error("VITE_API_URL must be set to the deployed API URL.");
}

const apiBaseUrl = new URL(configuredApiUrl || "http://localhost:5000");

if (import.meta.env.PROD && apiBaseUrl.protocol !== "https:") {
    throw new Error("VITE_API_URL must use HTTPS in production.");
}

export const apiUrl = (path) =>
    new URL(path.replace(/^\/+/, ""), `${apiBaseUrl.href.replace(/\/+$/, "")}/`).href;
