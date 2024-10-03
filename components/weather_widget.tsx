"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface weatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget(){
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<weatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = location.trim();
        if(trimmedLocation === ""){
            setError("Please Enter a Valid Location.");
            setWeather(null);
            return;
        };
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
                throw new Error("City Not Found");
            }
            const data = await response.json();
            const weatherData: weatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.current.name,
                unit: "C",
            };
            setWeather(weatherData);
        }catch(error){
            setError("City Not Found Please Try Again.");
            setWeather(null);
        }finally{
            setIsLoading(false);
        }
    };
    function getTemperatureMessage(temperature:number,unit:string): string {
        if(unit == "C"){
            if(temperature < 0){
                return `It's Freezing at ${temperature}℃! bundle up!`;
            }else if(temperature < 10){
                return `It's Quite Cold at ${temperature}℃. Wear Warm Clothes.`;
            }else if(temperature < 20){
                return `The Temperature Is ${temperature}℃. Comfortable for a Light Jacket.`;
            }else if(temperature < 30){
                return `It's a Pleasent ${temperature}℃. Enjoy The Nice Weather!`;
            }else {
                return `It's Hot at${temperature}℃. Stay Hydrated!`;
            }
        } else {
            // Placeholder for other temperature units (e.g fahrenheit)
            return `${temperature}°${unit}`;
        }
      }

      function getWeatherMessage (description:string):string{
        switch(description.toLocaleLowerCase()){
            case "Sunny":
                return "It's a Beautiful Sunny Day!";
            case "Partly Cloudy":
                return "Expect Some Clouds And Sunshine.";
            case "Cloudy":
                return "It's a Clody Today.";
            case "Overcast":
                return "The Sky Is Overcast.";
            case "Rain":
                return "Don't Forget Your Umbrella! It's Raining.";
            case "Thunderstorm":
                return "Thunderstorm are Expected Today.";
            case "Snow":
                return "Bundle up! It's Snowing.";
            case "Mist":
                return "It's Misty Outside.";     
            case "Fog":
                return "Be Careful, there's Fog Outside.";
            default:
                return description;
                // default returning to as it is                              
        }
    }
    function getLocationMessage(location:string):string{
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "at Night" : "DuringThe Day"}`;
    }

    return (                 //horizontal   //vertical
        <div className="flex justify-center items-center h-screen bg-zinc-800 shadow-red-950">
            <Card className="w-full max-w-md mx-auto text-center bg-slate-600 shadow-red-950">
                <CardHeader className="">
                    <CardTitle className="text-red-900">Weather Widget</CardTitle>
                    <CardDescription>Search For The Current Weather Condition In Your City</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSearch} className="flex items-center gap-2 shadow-red-950">
                    <Input 
                    className="bg-teal-900"
                    type="text"
                    placeholder="Enter a City Name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}></Input>
                    <Button className="bg-indigo-900" type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Search"}
                    </Button>
                </form>
                {error && <div className="mt-4 text-rose-950">{error}</div>}
                {weather && (
                    <div className="mt-4 grid gap-2">
                        <div className="flex items-center gap-2">
                            <ThermometerIcon className="w-6 h-6" />
                            {getTemperatureMessage(weather.temperature,weather.unit)}
                        </div>
                        <div className="flex items-center gap-2">
                            <CloudIcon className="w-6 h-6" />
                            {getWeatherMessage(weather.description)}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="w-6 h-6" />
                            {getLocationMessage(weather.location)}
                        </div>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
    )
}
