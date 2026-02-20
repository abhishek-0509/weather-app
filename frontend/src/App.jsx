import { useState } from "react";
import axios from "axios";

const API_BASE = "https://weather-backend-sma3.onrender.com";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchByCity = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError("");

    try {
      const weatherRes = await axios.get(
        `${API_BASE}/api/weather?city=${cityName}`
      );

      const forecastRes = await axios.get(
        `${API_BASE}/api/weather/forecast?city=${cityName}`
      );

      const dailyData = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setWeather(weatherRes.data);
      setForecast(dailyData);
    } catch {
      setError("City not found or server error.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCoordinates = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const weatherRes = await axios.get(
        `${API_BASE}/api/weather/coordinates?lat=${lat}&lon=${lon}`
      );

      const forecastRes = await axios.get(
        `${API_BASE}/api/weather/forecast/coordinates?lat=${lat}&lon=${lon}`
      );

      const dailyData = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setWeather(weatherRes.data);
      setForecast(dailyData);
    } catch {
      setError("Unable to fetch location weather.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchByCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("Location permission denied.");
      }
    );
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      fetchByCity(city);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 text-white">

        <h1 className="text-3xl font-bold text-center mb-6">
          Weather App
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleEnter}
            className="flex-1 px-4 py-3 rounded-xl text-black"
          />

          <button
            onClick={() => fetchByCity(city)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl"
          >
            Search
          </button>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleLocation}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl"
          >
            Use My Location
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-300">{error}</p>}

        {weather && !loading && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="bg-white/30 p-4 rounded-xl text-center">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <p className="text-xl font-bold">
                  {Math.round(day.main.temp)}°C
                </p>
                <p className="capitalize">
                  {day.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
