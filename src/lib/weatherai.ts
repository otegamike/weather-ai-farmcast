import axios from "axios";

const weatherClient = axios.create({
  baseURL: process.env.WEATHER_AI_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ==========================================
// API MONITORING CONSOLE INTERCEPTORS
// ==========================================

// 1. Monitor Outgoing Requests
weatherClient.interceptors.request.use((config) => {
  const timestamp = new Date().toISOString();
  console.log(`\n============== OUTGOING REQUEST [${timestamp}] ==============`);
  console.log(`URL:    ${config.baseURL}${config.url}`);
  console.log(`METHOD: ${config.method?.toUpperCase()}`);
  console.log(`PARAMS: ${JSON.stringify(config.params, null, 2)}`);
  console.log(`----------------------------------------------------------------`);
  return config;
}, (error) => {
  console.error("Request Setup Error:", error);
  return Promise.reject(error);
});

// 2. Monitor Incoming Responses
weatherClient.interceptors.response.use((response) => {
  const timestamp = new Date().toISOString();
  console.log(`\n============== INCOMING RESPONSE [${timestamp}] ==============`);
  console.log(`URL:    ${response.config.baseURL}${response.config.url}`);
  console.log(`STATUS: ${response.status} ${response.statusText}`);
  console.log(`DATA:   `, JSON.stringify(response.data, null, 2));
  console.log(`================================================================\n`);
  return response;
}, (error) => {
  const timestamp = new Date().toISOString();
  console.log(`\n============== API ERROR RESPONSE [${timestamp}] ==============`);
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    console.log(`URL:    ${error.config?.baseURL}${error.config?.url}`);
    console.log(`STATUS: ${error.response.status}`);
    console.log(`DATA:   `, JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    // The request was made but no response was received (e.g., Timeout)
    console.log(`STATUS: No response received. Network issue or Timeout triggered.`);
  } else {
    console.log(`ERROR MESSAGE:`, error.message);
  }
  console.log(`================================================================\n`);
  return Promise.reject(error);
});

export default weatherClient;