export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
export const USER_API_END_POINT = `${BACKEND_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BACKEND_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BACKEND_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BACKEND_URL}/api/v1/company`;

export const resolveFileUrl = (url) => {
    if (!url) return "";
    
    // If it's already a full HTTP/HTTPS URL or blob/data URI, return as-is
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("data:")) {
        return url;
    }
    
    // Otherwise append the backend URL for relative paths
    return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};