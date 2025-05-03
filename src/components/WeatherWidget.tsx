
import { RefreshCw, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  weatherId: number;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  city: string;
  country: string;
  dt: number;
}

interface WeatherWidgetProps {
  city?: string;
  apiKey?: string;
}

export default function WeatherWidget({ city = "Taquaritinga,BR", apiKey }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  const refreshWeather = async () => {
    setLoading(true);
    fetchWeather();
  };

  const fetchWeather = async () => {
    if (!apiKey) {
      // Use mock data when API key is not provided
      const mockData = {
        temp: 25.9,
        feelsLike: 26.2,
        description: "nublado",
        weatherId: 804,
        icon: "04d",
        humidity: 64,
        windSpeed: 2.5,
        pressure: 1012,
        visibility: 10,
        city: "Taquaritinga",
        country: "BR",
        dt: Date.now() / 1000
      };
      
      setTimeout(() => {
        setWeather(mockData);
        setLoading(false);
      }, 1000);
      
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do tempo");
      }
      
      const data = await response.json();
      
      setWeather({
        temp: Math.round(data.main.temp * 10) / 10,
        feelsLike: Math.round(data.main.feels_like * 10) / 10,
        description: data.weather[0].description,
        weatherId: data.weather[0].id,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        city: data.name,
        country: data.sys.country,
        dt: data.dt
      });
    } catch (err) {
      setError("Não foi possível carregar a previsão do tempo");
      console.error("Erro ao buscar previsão do tempo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // Update every 30 minutes
    
    return () => clearInterval(interval);
  }, [city, apiKey]);

  const getWeatherIcon = () => {
    if (!weather) return null;
    
    const { weatherId, icon } = weather;

    if (weatherId >= 200 && weatherId < 300) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#efefef" d="M49.7,26.7c0-8.3-6.7-15-15-15c-6.5,0-12,4.1-14.1,9.9c-0.9-0.2-1.9-0.4-2.9-0.4c-5.8,0-10.5,4.7-10.5,10.5 c0,5.8,4.7,10.5,10.5,10.5h32c5.5,0,10-4.5,10-10C49.7,30.7,49.7,28.5,49.7,26.7z"/>
            <path fill="#d4d4d4" d="M49.7,33.2c0,4.9-4,9-9,9h-32c-5.2,0-9.5-4.3-9.5-9.5c0-5.2,4.3-9.5,9.5-9.5c1.3,0,2.6,0.3,3.8,0.8 c1.7-6.4,7.5-11.1,14.4-11.1c8.3,0,15,6.7,15,15c0,1.2-0.1,2.4-0.4,3.5C45.9,30.4,49.7,31.5,49.7,33.2z"/>
            <path fill="#ffce47" d="M20,40l3,5l-3,5l4,0l3,5l3-5l4,0l-3-5l3-5L20,40z"/>
          </g>
        </svg>
      );
    } else if (weatherId >= 300 && weatherId < 400) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#efefef" d="M49.7,26.7c0-8.3-6.7-15-15-15c-6.5,0-12,4.1-14.1,9.9c-0.9-0.2-1.9-0.4-2.9-0.4c-5.8,0-10.5,4.7-10.5,10.5 c0,5.8,4.7,10.5,10.5,10.5h32c5.5,0,10-4.5,10-10C49.7,30.7,49.7,28.5,49.7,26.7z"/>
            <path fill="#d4d4d4" d="M49.7,33.2c0,4.9-4,9-9,9h-32c-5.2,0-9.5-4.3-9.5-9.5c0-5.2,4.3-9.5,9.5-9.5c1.3,0,2.6,0.3,3.8,0.8 c1.7-6.4,7.5-11.1,14.4-11.1c8.3,0,15,6.7,15,15c0,1.2-0.1,2.4-0.4,3.5C45.9,30.4,49.7,31.5,49.7,33.2z"/>
            <path fill="#00b4ff" d="M30,40c0,0-5,8-5,10c0,2.8,5,2.8,5,0C30,48,30,40,30,40z"/>
            <path fill="#00b4ff" d="M40,38c0,0-5,8-5,10c0,2.8,5,2.8,5,0C40,46,40,38,40,38z"/>
            <path fill="#00b4ff" d="M20,38c0,0-5,8-5,10c0,2.8,5,2.8,5,0C20,46,20,38,20,38z"/>
          </g>
        </svg>
      );
    } else if (weatherId >= 500 && weatherId < 600) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#efefef" d="M49.7,26.7c0-8.3-6.7-15-15-15c-6.5,0-12,4.1-14.1,9.9c-0.9-0.2-1.9-0.4-2.9-0.4c-5.8,0-10.5,4.7-10.5,10.5 c0,5.8,4.7,10.5,10.5,10.5h32c5.5,0,10-4.5,10-10C49.7,30.7,49.7,28.5,49.7,26.7z"/>
            <path fill="#d4d4d4" d="M49.7,33.2c0,4.9-4,9-9,9h-32c-5.2,0-9.5-4.3-9.5-9.5c0-5.2,4.3-9.5,9.5-9.5c1.3,0,2.6,0.3,3.8,0.8 c1.7-6.4,7.5-11.1,14.4-11.1c8.3,0,15,6.7,15,15c0,1.2-0.1,2.4-0.4,3.5C45.9,30.4,49.7,31.5,49.7,33.2z"/>
            <path fill="#00b4ff" d="M30,40c0,0-7,10-7,12c0,3.5,7,3.5,7,0C30,50,30,40,30,40z"/>
            <path fill="#00b4ff" d="M40,38c0,0-7,10-7,12c0,3.5,7,3.5,7,0C40,48,40,38,40,38z"/>
            <path fill="#00b4ff" d="M20,38c0,0-7,10-7,12c0,3.5,7,3.5,7,0C20,48,20,38,20,38z"/>
          </g>
        </svg>
      );
    } else if (weatherId >= 600 && weatherId < 700) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#efefef" d="M49.7,26.7c0-8.3-6.7-15-15-15c-6.5,0-12,4.1-14.1,9.9c-0.9-0.2-1.9-0.4-2.9-0.4c-5.8,0-10.5,4.7-10.5,10.5 c0,5.8,4.7,10.5,10.5,10.5h32c5.5,0,10-4.5,10-10C49.7,30.7,49.7,28.5,49.7,26.7z"/>
            <path fill="#d4d4d4" d="M49.7,33.2c0,4.9-4,9-9,9h-32c-5.2,0-9.5-4.3-9.5-9.5c0-5.2,4.3-9.5,9.5-9.5c1.3,0,2.6,0.3,3.8,0.8 c1.7-6.4,7.5-11.1,14.4-11.1c8.3,0,15,6.7,15,15c0,1.2-0.1,2.4-0.4,3.5C45.9,30.4,49.7,31.5,49.7,33.2z"/>
            <circle fill="white" cx="20" cy="45" r="3"/>
            <circle fill="white" cx="30" cy="45" r="3"/>
            <circle fill="white" cx="40" cy="45" r="3"/>
            <circle fill="white" cx="25" cy="52" r="3"/>
            <circle fill="white" cx="35" cy="52" r="3"/>
          </g>
        </svg>
      );
    } else if (weatherId >= 700 && weatherId < 800) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#efefef" d="M49.7,26.7c0-8.3-6.7-15-15-15c-6.5,0-12,4.1-14.1,9.9c-0.9-0.2-1.9-0.4-2.9-0.4c-5.8,0-10.5,4.7-10.5,10.5 c0,5.8,4.7,10.5,10.5,10.5h32c5.5,0,10-4.5,10-10C49.7,30.7,49.7,28.5,49.7,26.7z"/>
            <path fill="#d4d4d4" d="M49.7,33.2c0,4.9-4,9-9,9h-32c-5.2,0-9.5-4.3-9.5-9.5c0-5.2,4.3-9.5,9.5-9.5c1.3,0,2.6,0.3,3.8,0.8 c1.7-6.4,7.5-11.1,14.4-11.1c8.3,0,15,6.7,15,15c0,1.2-0.1,2.4-0.4,3.5C45.9,30.4,49.7,31.5,49.7,33.2z"/>
            <rect fill="white" x="15" y="45" width="30" height="2" rx="1"/>
            <rect fill="white" x="20" y="50" width="25" height="2" rx="1"/>
            <rect fill="white" x="17" y="55" width="30" height="2" rx="1"/>
          </g>
        </svg>
      );
    } else if (weatherId === 800) {
      if (icon.includes('n')) {
        return (
          <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <g>
              <path fill="#ffce47" d="M43.2,30c0,11.7-9.5,21.2-21.2,21.2s-21.2-9.5-21.2-21.2s9.5-21.2,21.2-21.2S43.2,18.3,43.2,30z"/>
              <path fill="#ffce47" d="M22,13.1V3.7c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8v9.4c0,1-0.8,1.8-1.8,1.8S22,14.1,22,13.1z"/>
              <path fill="#ffce47" d="M22,46.9v9.4c0,1,0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8v-9.4c0-1-0.8-1.8-1.8-1.8S22,45.9,22,46.9z"/>
              <path fill="#ffce47" d="M13.1,30H3.7c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h9.4c1,0,1.8-0.8,1.8-1.8S14.1,30,13.1,30z"/>
              <path fill="#ffce47" d="M46.9,30h-9.4c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h9.4c1,0,1.8-0.8,1.8-1.8S47.9,30,46.9,30z"/>
              <path fill="#ffce47" d="M14.5,17.6l-6.6-6.6c-0.7-0.7-0.7-1.8,0-2.5s1.8-0.7,2.5,0l6.6,6.6c0.7,0.7,0.7,1.8,0,2.5S15.2,18.3,14.5,17.6z"/>
              <path fill="#ffce47" d="M44.5,47.6l-6.6-6.6c-0.7-0.7-0.7-1.8,0-2.5s1.8-0.7,2.5,0l6.6,6.6c0.7,0.7,0.7,1.8,0,2.5S45.2,48.3,44.5,47.6z"/>
              <path fill="#ffce47" d="M17.6,44.5l-6.6,6.6c-0.7,0.7-1.8,0.7-2.5,0s-0.7-1.8,0-2.5l6.6-6.6c0.7-0.7,1.8-0.7,2.5,0S18.3,43.8,17.6,44.5z"/>
              <path fill="#ffce47" d="M47.6,14.5l-6.6,6.6c-0.7,0.7-1.8,0.7-2.5,0s-0.7-1.8,0-2.5l6.6-6.6c0.7-0.7,1.8-0.7,2.5,0S48.3,13.8,47.6,14.5z"/>
            </g>
          </svg>
        );
      } else {
        return (
          <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <g>
              <path fill="#ffce47" d="M43.2,30c0,11.7-9.5,21.2-21.2,21.2s-21.2-9.5-21.2-21.2s9.5-21.2,21.2-21.2S43.2,18.3,43.2,30z"/>
              <path fill="#ffce47" d="M22,13.1V3.7c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8v9.4c0,1-0.8,1.8-1.8,1.8S22,14.1,22,13.1z"/>
              <path fill="#ffce47" d="M22,46.9v9.4c0,1,0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8v-9.4c0-1-0.8-1.8-1.8-1.8S22,45.9,22,46.9z"/>
              <path fill="#ffce47" d="M13.1,30H3.7c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h9.4c1,0,1.8-0.8,1.8-1.8S14.1,30,13.1,30z"/>
              <path fill="#ffce47" d="M46.9,30h-9.4c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h9.4c1,0,1.8-0.8,1.8-1.8S47.9,30,46.9,30z"/>
              <path fill="#ffce47" d="M14.5,17.6l-6.6-6.6c-0.7-0.7-0.7-1.8,0-2.5s1.8-0.7,2.5,0l6.6,6.6c0.7,0.7,0.7,1.8,0,2.5S15.2,18.3,14.5,17.6z"/>
              <path fill="#ffce47" d="M44.5,47.6l-6.6-6.6c-0.7-0.7-0.7-1.8,0-2.5s1.8-0.7,2.5,0l6.6,6.6c0.7,0.7,0.7,1.8,0,2.5S45.2,48.3,44.5,47.6z"/>
              <path fill="#ffce47" d="M17.6,44.5l-6.6,6.6c-0.7,0.7-1.8,0.7-2.5,0s-0.7-1.8,0-2.5l6.6-6.6c0.7-0.7,1.8-0.7,2.5,0S18.3,43.8,17.6,44.5z"/>
              <path fill="#ffce47" d="M47.6,14.5l-6.6,6.6c-0.7,0.7-1.8,0.7-2.5,0s-0.7-1.8,0-2.5l6.6-6.6c0.7-0.7,1.8-0.7,2.5,0S48.3,13.8,47.6,14.5z"/>
            </g>
          </svg>
        );
      }
    } else if (weatherId >= 801 && weatherId <= 802) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#ffce47" d="M19.7,19.7c0-6.1,5-11.1,11.1-11.1c0.5,0,1.1,0,1.6,0.1c-1.5-2.1-3.9-3.4-6.6-3.4c-4.4,0-8,3.6-8,8c0,0.4,0,0.8,0.1,1.2C13.1,15.6,10,19.3,10,23.7c0,5.2,4.2,9.4,9.4,9.4h11.1c4.4,0,8-3.6,8-8C38.6,20.9,35,17.8,30.6,17.8C24.7,17.8,19.9,22.4,19.7,19.7z"/>
            <path fill="#efefef" d="M47.3,29.1c0-5.5-4.5-10-10-10c-4.3,0-8,2.7-9.4,6.6c-0.6-0.1-1.3-0.2-1.9-0.2c-3.9,0-7,3.1-7,7s3.1,7,7,7h21.3c3.7,0,6.7-3,6.7-6.7C54,30.9,50.9,28.2,47.3,29.1z"/>
          </g>
        </svg>
      );
    } else if (weatherId >= 803 && weatherId <= 804) {
      return (
        <svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
          <g>
            <path fill="#efefef" d="M49.7,26.7c0-8.3-6.7-15-15-15c-6.5,0-12,4.1-14.1,9.9c-0.9-0.2-1.9-0.4-2.9-0.4c-5.8,0-10.5,4.7-10.5,10.5 c0,5.8,4.7,10.5,10.5,10.5h32c5.5,0,10-4.5,10-10C49.7,30.7,49.7,28.5,49.7,26.7z"/>
            <path fill="#d4d4d4" d="M49.7,33.2c0,4.9-4,9-9,9h-32c-5.2,0-9.5-4.3-9.5-9.5c0-5.2,4.3-9.5,9.5-9.5c1.3,0,2.6,0.3,3.8,0.8 c1.7-6.4,7.5-11.1,14.4-11.1c8.3,0,15,6.7,15,15c0,1.2-0.1,2.4-0.4,3.5C45.9,30.4,49.7,31.5,49.7,33.2z"/>
          </g>
        </svg>
      );
    }

    return null;
  };

  const getBackgroundGradient = () => {
    if (!weather) return "bg-gradient-to-r from-blue-500 to-blue-600";

    const temp = weather.temp;
    
    if (temp < 0) {
      return "bg-gradient-to-r from-[#1e3c72] to-[#2a5298]";
    } else if (temp < 10) {
      return "bg-gradient-to-r from-[#2980b9] to-[#6dd5fa]";
    } else if (temp < 20) {
      return "bg-gradient-to-r from-[#a8e063] to-[#56ab2f]";
    } else if (temp < 30) {
      return "bg-gradient-to-r from-[#f2994a] to-[#f2c94c]";
    } else {
      return "bg-gradient-to-r from-[#f12711] to-[#f5af19]";
    }
  };

  if (error) {
    return null;
  }

  return (
    <Card className={`${getBackgroundGradient()} text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/20">
        <div>
          <h2 className="text-lg md:text-xl font-medium mb-1 animate-fadeInUp">
            {weather?.city || city.split(',')[0]}
          </h2>
          <p className="text-sm text-white/80 animate-fadeInUp" style={{animationDelay: "0.2s"}}>
            {loading ? "Atualizando dados..." : weather?.dt ? formatDate(weather.dt) : "Sem dados"}
          </p>
        </div>
        
        <button 
          onClick={refreshWeather}
          className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:bg-white/30"
          disabled={loading}
        >
          <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <RefreshCw className="w-12 h-12 animate-spin" />
        </div>
      ) : (
        <>
          {/* Main content */}
          <div className="p-4 flex justify-between items-center">
            <div className="animate-fadeInUp" style={{animationDelay: "0.4s"}}>
              <h1 className="text-4xl font-bold relative">
                {weather?.temp}
                <span className="absolute text-xl">°C</span>
              </h1>
              <p className="text-sm text-white/80">
                Sensação térmica: {weather?.feelsLike}°C
              </p>
            </div>
            
            <div className="animate-fadeInUp animate-float" style={{animationDelay: "0.6s"}}>
              {getWeatherIcon()}
            </div>
          </div>
          
          {/* Weather description */}
          <h3 className="text-center text-lg animate-fadeInUp capitalize" style={{animationDelay: "0.8s"}}>
            {weather?.description || "Carregando..."}
          </h3>
          
          {/* Details */}
          <div className="mx-4 mb-4 mt-2 bg-white/10 rounded-lg p-4 grid grid-cols-2 gap-4 animate-fadeInUp" style={{animationDelay: "1s"}}>
            <div className="flex flex-col items-center">
              <span className="text-sm text-white/80 mb-1">Umidade</span>
              <span className="text-lg font-medium">{weather?.humidity}%</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-white/80 mb-1">Vento</span>
              <span className="text-lg font-medium">{weather?.windSpeed} m/s</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-white/80 mb-1">Pressão</span>
              <span className="text-lg font-medium">{weather?.pressure} hPa</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-white/80 mb-1">Visibilidade</span>
              <span className="text-lg font-medium">{weather?.visibility} km</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
