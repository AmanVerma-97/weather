import { useEffect, useRef, useState } from "react";
import { useWeatherData } from "../fetchData/fetchDataContext";
import { Link } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function Home(){
    
    const [inputCity, setInputCity]= useState("");
    const {setCity, weatherData, aqiData, error, background, localTime} = useWeatherData();
    const [aqiColor, setAqiColor]= useState(null);
    const [theme, setTheme]=useState("light");
    const [listening, setListening]=useState(false);
    const cityRef=useRef("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("SpeechRecognition is not supported in this browser.");
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // 'false' so that it stops after a small pause, if 'true' it will keep on listening
    recognition.interimResults = false;
    recognition.lang = "en-US"; // Set language for voice recognition
    
    const startListening = () => {
        setListening(true);
        recognition.start();

        recognition.onresult = (event) => {

            
            
            const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

            console.log("Voice search--",listening);
            
            setInputCity(transcript);
            handleSearch();
        };
    
        recognition.onend = () => {
          setListening(false);
        };

      };
    
    const stopListening = () => {
        setListening(false);
        recognition.stop();
        
        // setInputCity("");
    }
    
    //to switch between light and dark themes

    // 1.On initial render theme will be same as theme on user's computer
     //1 A. TO SWITCH TO USER'S THEME WHEN THEY CHANGE IT
    // useEffect(()=>{
    //     if(window.matchMedia('(prefers-color-scheme: dark)').matches){
    //         setTheme("dark");
    //     }
    //     else{
    //         setTheme("light");
    //     }
    // },[])
     
    // 2. To switch themes
    useEffect(()=>{
        if(theme==="dark"){
            document.documentElement.classList.add("dark");
        }
        else{
            document.documentElement.classList.remove("dark");
        }
    },[theme])

   
    const handleThemeSwitch=()=>{
        setTheme(theme==="dark"? "light" : "dark"); 
    }


    function handleSearch(){
        setListening(false);
        setCity(inputCity);
        
        // cityRef.current.focus();
    }

    const handleKeySearch=(event)=>{
        if(event.key==="Enter"){
            handleSearch();
        }
        else{
            setInputCity(event.target.value);
        }
    }
     
    
    //Convert time received from API in local time for that zone.
    function convertTimestamp(timestamp,timezone) {
        const sunDate= new Date((timestamp+timezone)*1000 );
        let sunHours=sunDate.getHours();
        let sunMinutes=sunDate.getMinutes();
        if(sunMinutes>=30){
            sunMinutes-=30;
            if(sunHours>=6){
                sunHours-=5;
            }
            else{
                sunHours+=17;
            }
            
        }
        else{
            sunMinutes+=30;
            if(sunHours>=6){
                sunHours-=6;
            }
            else{
                sunHours+=18;
            }
        }
        sunHours = sunHours.toString().padStart(2, '0');
        sunMinutes = sunMinutes.toString().padStart(2, '0');
        return (`${sunHours}:${sunMinutes}`);
      }


      //set AQi color to show level of AQI
      useEffect(()=>{
        setInputCity("");
        if(aqiData){
            console.log("BG",background);
            
            let colorClass;
            if(aqiData<50){
                colorClass="text-green-800";
            }
            else if(aqiData<100){
                colorClass="text-amber-600";
            }
            else if(aqiData<150){
                colorClass="text-orange-700";
            }
            else if(aqiData<200){
                colorClass="text-red-500";
            }
            else if(aqiData<300){
                colorClass="text-indigo-600";
            }
            else{
                colorClass="text-purple-800";
            }
            setAqiColor(colorClass);
        }
        
      },[aqiData])
      

    return(
        <>
        { error ? <Link to="error"> <button className="bg-slate-600 text-yellow-500 font-bold p-2 rounded-md block m-auto mt-20">
            <span className="text-red-500">Error.</span> Click to see details </button> </Link> :

        // Outermost div
        // <div id="outermost" class="bg-teal-300 font-medium font-serif h-screen w-dvw pt-2
        //             dark:bg-gradient-to-r dark:from-slate-950 dark:via-grey-800 dark:to-slate-900 dark:text-white">
        <div id="outermost" className="text-black bg-no-repeat bg-center bg-cover bg-amber-200 font-medium font-serif h-screen w-dvw pt-2 
                                dark:bg-black/85 dark:bg-opacity-65 dark:bg-blend-overlay dark:text-white "
                                style={{backgroundImage: `url(${background})`}}>
            

            {/* Search bar */}
            <div className="m-auto p-3 flex flex-col md:flex-row items-center gap-4 w-fit bg-transparent 
                        mb-8">
                
                <div class=" relative">

                    
                    <input id="city" type="text" className="inline bg-blue-200 p-2 placeholder-slate-500 font rounded w-60 md:w-80 text-center
                    text-black dark:bg-slate-200 dark:border-gray-500 dark:hover:border-blue-300 dark:border-2" 
                    placeholder="Enter city" ref={cityRef} value={inputCity} onChange={(e)=>setInputCity(e.target.value)} onKeyUp={handleKeySearch}  required/>
                    <button onClick={listening ? stopListening : startListening}>
                       
                       {listening ? <img src="https://cdn-icons-png.flaticon.com/128/16311/16311095.png" alt="mic on" className="h-5 w-5 right-1 top-2.5 inline absolute cursor-pointer" /> :<img src="https://cdn-icons-png.flaticon.com/128/25/25682.png" alt="mic off" className="h-5 w-5 right-1 top-2.5 inline absolute cursor-pointer"/> } 
                        
                    </button>
                    
                </div>
            
                <div>
                    <button onClick={handleSearch} 
                    className="bg-slate-400 w-60 md:w-auto h-auto rounded p-2
                     hover:bg-slate-700 hover:text-white hover:outline-blue-300 hover:outline-2
                     dark:text-black"> Search </button>
                </div>
                
                
                
            </div>

            {/* Light Mode/ Dark Mode */}
            <div className="absolute top-4 right-6 h-auto w-6 flex justify-center">
                <button className="bg-transparent m-auto" onClick={handleThemeSwitch}>
                    {theme==="dark"? <img src="https://cdn-icons-png.flaticon.com/128/3073/3073665.png" alt="light-mode" className="h-4 w-4 inline cursor-pointer"/>
                                   : <img src="https://cdn-icons-png.flaticon.com/128/8648/8648533.png" alt="dark-mode" className="h-4 w-4 inline cursor-pointer"/> }
                </button>
            </div>
            
            {/* Displaying data if API fetch success */}
            { weatherData && aqiData && 
            <div className="border-black border dark:border-white dark:bg-gray-800/50 rounded-md h-auto w-10/12 m-auto  mt-2 flex flex-col items-center gap-6 dark:shadow-lg dark:shadow-black
             sm:w-8/12 md:w-6/12  xl:w-4/12 md:m-auto md:mt-12 p-4  shadow-lg shadow-emerald-950/80 bg-stone-300/85">
                <div> 
                    <h3 className="font-extrabold inline text-2xl"> {weatherData.name}</h3>
                </div>


                <div> <h1 className="font-extrabold text-3xl"> {weatherData.main.temp} &deg;C </h1> </div>

                <div><h3 className="font-extrabold"> {weatherData.weather[0].main} </h3></div>

                <div className="font-bold text-lg"> 
                    AQI <span id="aqi" className={aqiColor}> {aqiData} </span> 
                </div>
            
                <div>
                    <h3 className="inline text-lg font-bold"> {localTime.toLocaleString()} </h3>
                </div>
            </div>
            }

            {weatherData && aqiData && 
            <div className="border-black border dark:border-white dark:bg-gray-800/50 rounded-md h-auto w-11/12 mt-8 m-auto flex flex-wrap gap-4 justify-between items-center p-2 font-mono dark:shadow-lg dark:shadow-black
            md:flex-row md:w-10/12 xl:w-8/12 md:m-auto md:min-h-24 md:mt-12 shadow-xl shadow-emerald-950/80 bg-stone-300/85">
                <div className="flex gap-2 w-1/3 sm:w-1/4 md:w-auto"> <img src="https://cdn-icons-png.flaticon.com/128/4851/4851827.png" className="h-8 w-8 inline" alt="min-temp"/> 
                {weatherData.main.temp_min} &deg;C</div>

                <div className="flex gap-2 w-1/3 sm:w-1/4 md:w-auto"> <img  src="https://cdn-icons-png.flaticon.com/128/3236/3236862.png" className="h-8 w-8 inline" alt="max-temp"/> 
                {weatherData.main.temp_max} &deg;C </div>

                <div className="flex gap-2 w-1/3 sm:w-1/4 md:w-auto"> <img src="https://cdn-icons-png.flaticon.com/128/3175/3175147.png" className="h-8 w-8 inline" alt="sunrise"/>
                {convertTimestamp(weatherData.sys.sunrise, weatherData.timezone)} </div>

                <div className="flex gap-2 w-1/3 sm:w-1/4 md:w-auto"> <img src="https://cdn-icons-png.flaticon.com/128/4814/4814444.png" className="h-8 w-8 inline" alt="sunset"/> 
                {convertTimestamp(weatherData.sys.sunset, weatherData.timezone)} </div>

                <div className="flex gap-2 w-1/3 sm:w-1/4 md:w-auto"> <img src="https://cdn-icons-png.flaticon.com/128/8923/8923690.png" className="h-8 w-8 inline" alt="sunset"/> 
                {weatherData.main.humidity}% </div>

                <div className="flex gap-2 w-1/3 sm:w-1/4 md:w-auto"> <img src="https://cdn-icons-png.flaticon.com/128/3579/3579552.png" className="h-8 w-8 inline" alt="sunset"/> 
                {weatherData.wind.speed} Km/Hr </div>

            </div>}
        </div>
        }
        
        </>
    )
}

export default Home;