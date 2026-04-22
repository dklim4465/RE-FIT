import axios from "axios";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";

export function createHttpClient(config = {}) {
  return axios.create({
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
}

export const ollamaClient = createHttpClient({
  baseURL:
    import.meta.env.VITE_OLLAMA_BASE_URL?.trim() || DEFAULT_OLLAMA_BASE_URL,
});
