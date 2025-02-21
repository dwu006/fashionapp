import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "3acd2d8703126ae2cb35ac917c98be4c"; // Replace with your OpenWeather API key

const WeatherBox = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Loading...");

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`
        );
        setWeather(response.data);
        setCity(response.data.name);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to Cupertino if location access is denied
          fetchWeather(37.3229, -122.0322);
          setCity("Cupertino");
        }
      );
    } else {
      fetchWeather(37.3229, -122.0322);
      setCity("Cupertino");
    }
  }, []);

  if (!weather) {
    return <div className="weather-box">Loading weather...</div>;
  }

  // Map weather descriptions to emojis
  const weatherEmojis = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌁",
    Drizzle: "🌦️",
  };

  const weatherCondition = weather.weather[0].main;
  const weatherEmoji = weatherEmojis[weatherCondition] || "❓"; // Default emoji if condition not found

  return (
    <div className="weather-box">
      <p className="weather-city">{city}</p>
      <p className="weather-info">
        {Math.round(weather.main.temp)}°F {weatherCondition} {weatherEmoji}
      </p>
    </div>
  );
};

export default WeatherBox;
