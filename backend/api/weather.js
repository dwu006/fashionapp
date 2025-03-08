import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.WEATHER_API_KEY;

const getWeather = async (lat, lon) => {
  try {
    if (!API_KEY) {
      throw new Error("Weather API key not found in environment variables");
    }

    if (!lat || !lon) {
      // Default to Cupertino
      lat = 37.3229;
      lon = -122.0322;
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );

    if (!response.data || !response.data.main || !response.data.weather) {
      throw new Error("Invalid weather data received");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return { error: "Failed to fetch weather data" };
  }
};

export default getWeather;
