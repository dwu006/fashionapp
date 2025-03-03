import React, { useEffect, useState } from "react";

const WeatherBox = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) return;

    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
        );

        if (response.status === 404) {
          throw new Error("Location not found");
        } else if (!response.ok) {
          throw new Error("Failed to Fetch Weather");
        }

        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: capitalizeWords(data.weather[0].description),
          emoji: getWeatherEmoji(data.weather[0].id),
        });
      } catch (err) {
        setError("Weather data unavailable");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Location access denied");
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  const getWeatherEmoji = (weatherId) => {
    const emojiMap = {
      800: "☀️", // Clear sky
      801: "⛅", // Few clouds
      802: "☁️", // Scattered clouds
      803: "🌥", // Broken clouds
      804: "🌫", // Overcast clouds
      300: "🌧", // Drizzle
      500: "🌦", // Light rain
      501: "🌧", // Moderate rain
      502: "⛈", // Heavy rain
      600: "❄️", // Snow
      611: "🌨", // Sleet
      701: "🌫", // Fog
      771: "🌬", // Windy
    };
    return emojiMap[weatherId] || "❓";
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="weather-box">
      {error ? (
        <span className="weather-error">{error}</span>
      ) : weather ? (
        <span className="weather-info">
          Today's Weather: {weather.temperature}° {weather.condition}{" "}
          {weather.emoji}
        </span>
      ) : (
        <span className="loading-text">Fetching Weather...</span>
      )}
    </div>
  );
};

export default WeatherBox;
