import { useState } from 'react'  
import { BrowserRouter as BroweserRoute, Routes, Route } from 'react-router-dom';

import Register from './componets/Auth/Register.jsx';


import Login from './componets/Auth/Login.jsx';




 const App=()=> {
  return (
    
    <BroweserRoute>
      <Routes>

       
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
       
      </Routes>
    </BroweserRoute>
  )
}

export default App;
