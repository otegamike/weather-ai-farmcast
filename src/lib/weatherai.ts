import axios from "axios";

const weatherClient = axios.create({
  baseURL: process.env.WEATHER_AI_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

weatherClient.interceptors.request.use((config) => {
  console.log("[WeatherAPI] requesting...");
  return config;
}, (error) => {
  console.error("[WeatherAPI] request failed:", error.message);
  return Promise.reject(error);
});

weatherClient.interceptors.response.use((response) => {
  console.log("[WeatherAPI] request successful");
  return response;
}, (error) => {
  const status = error.response?.status ?? "Network Error";
  console.error("[WeatherAPI] request failed:", status);
  return Promise.reject(error);
});

export default weatherClient;