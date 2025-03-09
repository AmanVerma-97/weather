//using Context API.
import { createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import image1 from '../assets/images/clear-day-sky.jpg';
import image2 from '../assets/images/fog-night.jpg';
import image3 from '../assets/images/lightning-night-rain.jpg';
import image4 from '../assets/images/winter-snowfall.jpg';
import image5 from '../assets/images/clouds.jpg';
import image6 from '../assets/images/rainy-day.jpg';
import image7 from '../assets/images/fog-day.jpg';
import image8 from '../assets/images/clear-night-sky.jpg';
import image9 from '../assets/images/clear-evening-sky.jpg';



const weatherContext=createContext();

function useWeatherData(){
   return useContext(weatherContext);
}

function FetchDataContext(props) {
    
    const [city,setCity] = useState(null);
    const [weatherData,setWeatherData] = useState(null);
    const [aqiData, setAqiData]= useState(null);
    const [timezone, setTimezone]=useState(null);
    const [localTime, setLocalTime]=useState(null);
    const [background, setBackground]=useState(image1);
    const [error,setError]=useState(false);
    const {children}=props; //all that use weatherContext.

    async function fetchCurrentAQI(city) {
        const API_KEY="37947d013f98ab57272fe2d0aadbdfdf";
        try {
          // Step 1: Get the city's latitude and longitude using the Geocoding API
          const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
          
          if (geoResponse.data.length === 0) {
            setError("City not found");
            return;
          }
  
          const { lat, lon } = geoResponse.data[0];
  
          // Step 2: Fetch the AQI using the Air Pollution API
          const aqiResponse = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  
          const aqiValue = aqiResponse.data.list[0].components.pm2_5;
          // console.log(aqiResponse);
          
          setAqiData(aqiValue);
        } catch (err) {
          setError("Error fetching AQI data");
          console.error(err);
        }
      }

    const fetchCityTime= async(city)=>{ //to get local time of city using timezone
      
      const API_KEY="37947d013f98ab57272fe2d0aadbdfdf";
      try {
        // Fetch weather data for the city
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );

        const timezoneOffset = response.data.timezone;
        // console.log(timezoneOffset);
        // Calculate the local time by adding the timezone offset (in seconds)
        const utcTime = new Date().getTime(); // In milliseconds

        // Calculate local time in milliseconds by adding the timezone offset
        const localTimeInMilliseconds = utcTime + timezoneOffset * 1000;
        const timeToSubtract = (5 * 60 * 60 * 1000) + (30 * 60 * 1000); //to subtrcat IST from final time
        
        // Create a new Date object for the local time (in UTC)
        const localDate = new Date(localTimeInMilliseconds-timeToSubtract);
        // Format the local time
        // console.log("Time", localDate.getHours());
        setTimezone(localDate.getHours());
        setLocalTime(localDate);
        // console.log(localDate.toLocaleString().split(",")[1]);
        
      } catch (err) {
        setError("Error fetching time for the city");
        console.error(err);
      }
      
        
      }

    

    useEffect(()=>{
      const fetchCurrentWeather= async(city)=>{
        const APIKey= "9f5b97bf1e84c5b6e30e95ea3d00cfa3"; 
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

        try {
            const response= await fetch(url);
            if(!response.ok){
                setWeatherData(null);
                throw new Error("Couldn't fetch city data");
            }
            const data= await response.json();
            // console.log("weather:",data);
            console.log(data);
           
             
            // setCity(data.name);
            fetchCityTime(city);
            fetchCurrentAQI(city.toUpperCase());
            setWeatherData(data);
            setError(false);

          } catch (error) {
              // console.log(error);
              setError(true);
          }
      }

      if(city){
            fetchCurrentWeather(city);
        }
        
    },[city]);

    useEffect(()=>{ //to set background image according to main weather 
        if(weatherData){
            let url;
            const mainWeather = weatherData.weather[0].main;
            const hours=timezone;
            if(mainWeather==="Clear"){
              if(hours>=7 && hours<17){
                url=image1;
              }
                else if(hours>=17 && hours<20){
                  url=image9;
                }
                else{
                  url=image8;
                }
            }
            else if(mainWeather==="Thunderstorm"){
                  url=image3;
            }

            else if(mainWeather==="Rain"){
                url=image6;
            }
            else if(mainWeather==="Snow"){
                url=image4;
            }
            else if(mainWeather==="Haze"){
                url=image2;
            }
            else if(mainWeather==="Clouds"){
                url=image5;
            }
            else{
                url=image7;
            }

            setBackground(url);
        }
    },[weatherData,timezone]);

    return(
        <>
            {/* <h3> I'am fetchData.</h3> */}
            <weatherContext.Provider value={{aqiData, city, setCity, weatherData, error, setError, setWeatherData, setAqiData,background, localTime}}>
                {children}
            </weatherContext.Provider>
        </>
        
    );
}

export {useWeatherData};
export default FetchDataContext;

