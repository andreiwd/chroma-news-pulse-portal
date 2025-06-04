
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Snowflake, 
  CloudDrizzle, 
  Zap,
  RefreshCw,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye
} from "lucide-react";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

interface WeatherWidgetProps {
  city?: string;
  apiKey?: string;
}

interface WeatherConfigData {
  city: string;
  apiKey: string;
  enabled: boolean;
}

export default function WeatherWidget({ city: propCity, apiKey: propApiKey }: WeatherWidgetProps) {
  const { getConfig } = useSupabaseConfig();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<WeatherConfigData | null>(null);

  // Load config from Supabase
  useEffect(() => {
    if (!propCity || !propApiKey) {
      const loadConfig = async () => {
        try {
          const weatherConfig = await getConfig('weather_config');
          
          if (weatherConfig && typeof weatherConfig === 'object') {
            // Type guard to ensure we have the right structure
            const configData = weatherConfig as Record<string, any>;
            setConfig({
              city: configData.city || 'São Paulo, BR',
              apiKey: configData.apiKey || '',
              enabled: configData.enabled === true
            });
          }
        } catch (error) {
          console.error("Error loading weather config:", error);
          setLoading(false);
        }
      };
      
      loadConfig();
    }
  }, [getConfig, propCity, propApiKey]);

  const getWeatherIcon = (weatherMain: string) => {
    const iconProps = { className: "w-12 h-12 text-white drop-shadow-lg" };
    
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} />;
      case 'clouds':
        return <Cloud {...iconProps} />;
      case 'rain':
        return <CloudRain {...iconProps} />;
      case 'drizzle':
        return <CloudDrizzle {...iconProps} />;
      case 'thunderstorm':
        return <Zap {...iconProps} />;
      case 'snow':
        return <Snowflake {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  const fetchWeather = async () => {
    const city = propCity || config?.city || "Taquaritinga,BR";
    const apiKey = propApiKey || config?.apiKey;

    if (!apiKey) {
      // Use mock data when API key is not provided
      const mockWeather: WeatherData = {
        name: city.split(',')[0] || "Taquaritinga",
        main: {
          temp: 25,
          feels_like: 27,
          humidity: 65,
          temp_min: 22,
          temp_max: 28
        },
        weather: [{
          main: "Clear",
          description: "céu limpo",
          icon: "01d"
        }],
        wind: {
          speed: 3.2
        },
        visibility: 10000
      };
      
      setWeather(mockWeather);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Não foi possível carregar os dados do clima");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carrega quando há props ou configuração habilitada
    const shouldLoad = (propCity && propApiKey) || (config && config.enabled);
    
    if (shouldLoad) {
      fetchWeather();
      const interval = setInterval(fetchWeather, 1800000); // Update every 30 minutes
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [propCity, propApiKey, config]);

  // Se está carregando configuração inicial, não renderizar
  if (!propCity && !propApiKey && !config) {
    return null;
  }

  // Se não está habilitado e não tem props, não renderizar
  if (!propCity && !propApiKey && config && !config.enabled) {
    return null;
  }

  // Se está carregando e não tem dados, mostrar loading simples
  if (loading && !weather) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
        <div className="flex justify-center items-center p-12">
          <RefreshCw className="w-12 h-12 animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-6 text-center">
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5" />
          {weather.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperatura Principal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.weather[0].main)}
            <div>
              <div className="text-3xl font-bold">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-sm opacity-90 capitalize">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        </div>

        {/* Sensação Térmica */}
        <div className="flex items-center gap-2 text-sm">
          <Thermometer className="w-4 h-4" />
          <span>Sensação: {Math.round(weather.main.feels_like)}°C</span>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            <span>{weather.main.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            <span>{weather.wind.speed} m/s</span>
          </div>
        </div>

        {/* Min/Max */}
        <div className="flex justify-between text-sm">
          <span>Mín: {Math.round(weather.main.temp_min)}°C</span>
          <span>Máx: {Math.round(weather.main.temp_max)}°C</span>
        </div>
      </CardContent>
    </Card>
  );
}
