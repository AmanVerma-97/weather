import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useWeatherData } from '../fetchData/fetchDataContext';

function ErrorPage() {
  const {setError, setWeatherData, setAqiData} = useWeatherData();

  useEffect(()=>{
    // console.log("Error",city);
    // console.log(error);
    // setCity("");
    // setError(false);
    setAqiData(null);
    setWeatherData(null);
  },[setAqiData, setWeatherData]);
  
  function resetValue(){
    setError(false);
  }

  return (
    <div className="bg-teal-200 h-screen w-full dark:bg-cyan-900 mt-0 py-8">
      <div className="w-10/12 h-4/5 sm:w-6/12 sm:h-4/5 m-auto flex items-center justify-center flex-col flex-wrap bg-slate-800 text-white gap-8 p-4 rounded-md">
        <h1 className="font-extrabold text-4xl text-center">An Error occured!!</h1>
        <p className="font-bold">City data does not exist.</p>
        <img src='https://cdn-icons-png.flaticon.com/128/3855/3855833.png' className="h-22 w-22" alt='error'/>
        <Link to="/"> <button className="bg-slate-600 text-yellow-500 font-bold p-2 rounded-md" onClick={resetValue}> BACK </button> </Link>
      </div>
    </div>
    
  )
}

export default ErrorPage;