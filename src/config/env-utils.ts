export function getEnv(name: string, fallback?: string): string {
    const v = process.env[name];
  
    if (!v || v.trim() === "") {
      return fallback ?? "";
    }
  
    return v.trim();
  }
  
  export function isDev() {
    return process.env.NODE_ENV === "development";
  }