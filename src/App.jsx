import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './Home/Home';
import ErrorPage from './Error/ErrorPage';
// import fetchDataContext from './fetchData/fetchDataContext';


const routes=createBrowserRouter([
  {
    path:"/",
    element:<Home/>,
  },
    
  {
    path:"/error", 
    element:<ErrorPage/>
  }
    
  
])
function App() {
  return (
    <>
      <RouterProvider router={routes}/>
    </>
        
  );
}

export default App;

