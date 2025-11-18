import { useState } from 'react'  
import { BrowserRouter as BroweserRoute, Routes, Route } from 'react-router-dom';



import Login from './componets/Auth/Login.jsx';




 const App=()=> {
  return (
    
    <BroweserRoute>
      <Routes>

       
        <Route path='/login' element={<Login/>}/>
       
      </Routes>
    </BroweserRoute>
  )
}

export default App;
