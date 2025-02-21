import axios from "axios";

const API_KEY = "3acd2d8703126ae2cb35ac917c98be4c";

const getWeather = async (lat, lon) => {
  try {
    if (!lat || !lon) {
      // Default to Cupertino
      lat = 37.3229;
      lon = -122.0322;
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return { error: "Failed to fetch weather data" };
  }
};

export default getWeather;
