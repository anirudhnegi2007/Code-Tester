
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import React from 'react';
import { auth,provider } from '../../firebase/config';


const Login = () => {
  const handleLogin = async () => {
    try {   
        const result = await signInWithRedirect(auth, provider);
        console.log("User Info:", result.user);
    } catch (error) {
        console.error("Error during login:",error);
    }
};
    return(
        <>
        <button onClick={handleLogin}>Login with Google</button>

        
        </>
    );
};

export default Login;