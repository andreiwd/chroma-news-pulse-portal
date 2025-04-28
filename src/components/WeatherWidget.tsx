
import { Sun, CloudSun, CloudRain, CloudSnow, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherWidgetProps {
  city?: string;
  apiKey?: string;
}

export default function WeatherWidget({ city = "Taquaritinga,BR", apiKey }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!apiKey) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do tempo");
        }
        
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
        });
      } catch (err) {
        setError("Não foi possível carregar a previsão do tempo");
        console.error("Erro ao buscar previsão do tempo:", err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // Update every 30 minutes
    
    return () => clearInterval(interval);
  }, [city, apiKey]);

  if (error || !weather) {
    return null;
  }

  const getWeatherIcon = () => {
    const iconCode = weather.icon;
    if (iconCode.includes("01")) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (iconCode.includes("02") || iconCode.includes("03") || iconCode.includes("04")) 
      return <CloudSun className="w-12 h-12 text-gray-500" />;
    if (iconCode.includes("09") || iconCode.includes("10")) 
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (iconCode.includes("13")) 
      return <CloudSnow className="w-12 h-12 text-blue-300" />;
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Previsão do Tempo</h3>
          <p className="text-sm text-muted-foreground">{city.split(',')[0]}</p>
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-red-500" />
          <span className="text-2xl font-bold">{weather.temp}°C</span>
        </div>
        
        <p className="text-sm capitalize">{weather.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Wind className="w-4 h-4" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-500">•</span>
            <span>{weather.humidity}% umidade</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
