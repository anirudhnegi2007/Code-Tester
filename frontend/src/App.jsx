import { useState } from 'react'  
import { BrowserRouter as BroweserRoute, Routes, Route } from 'react-router-dom';


import Register from './componets/Auth/Register.jsx';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import Login from './componets/Auth/Login.jsx';
import Homepage from './pages/Homepage.jsx';

import Dashboard from './pages/Dashboard.jsx';

const queryClient = new QueryClient();



 const App=()=> {
  return (

       <QueryClientProvider client={queryClient}>
    <BroweserRoute>
     
      <Routes>
      <Route path='/dashboard' element={<Dashboard/>}/>
       <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
       
      </Routes>
    </BroweserRoute>
    </QueryClientProvider>
  )
}

export default App;
