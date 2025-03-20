import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError('Unable to get location. Please enable location services.');
          toast.error('Location access denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    if (!location) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data');
      toast.error('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const getFarmingSuggestions = (weatherData: WeatherData) => {
    const suggestions = [];
    const { temp, humidity } = weatherData.main;
    const windSpeed = weatherData.wind.speed;

    if (humidity > 80) {
      suggestions.push({
        type: 'warning',
        message: 'High humidity detected. Monitor for potential fungal diseases.',
      });
    }

    if (temp > 30) {
      suggestions.push({
        type: 'warning',
        message: 'High temperature. Ensure adequate irrigation.',
      });
    }

    if (windSpeed > 20) {
      suggestions.push({
        type: 'warning',
        message: 'Strong winds. Consider protecting young plants.',
      });
    }

    if (humidity >= 60 && humidity <= 80 && temp >= 20 && temp <= 30) {
      suggestions.push({
        type: 'success',
        message: 'Ideal conditions for paddy growth.',
      });
    }

    return suggestions;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Weather & Farming Conditions</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {weather && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cloud className="h-16 w-16 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</p>
                    <p className="text-gray-600">{weather.weather[0].description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <WeatherStat
                    icon={<Droplets />}
                    label="Humidity"
                    value={`${weather.main.humidity}%`}
                  />
                  <WeatherStat
                    icon={<Wind />}
                    label="Wind"
                    value={`${Math.round(weather.wind.speed * 3.6)} km/h`}
                  />
                  <WeatherStat
                    icon={<Thermometer />}
                    label="Feels Like"
                    value={`${Math.round(weather.main.feels_like)}°C`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Farming Suggestions</h2>
              <ul className="space-y-4">
                {getFarmingSuggestions(weather).map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-6 w-6 rounded-full ${
                        suggestion.type === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      } flex items-center justify-center`}
                    >
                      <span
                        className={
                          suggestion.type === 'warning'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }
                      >
                        {suggestion.type === 'warning' ? '!' : '✓'}
                      </span>
                    </div>
                    <p className="ml-3 text-gray-600">{suggestion.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WeatherStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="text-gray-500 mb-1">{icon}</div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default Weather;