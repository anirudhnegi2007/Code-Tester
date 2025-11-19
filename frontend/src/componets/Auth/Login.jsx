
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect,sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { auth,provider } from '../../firebase/config';




import { useState } from 'react';
import { Mail, Lock, Code ,Eye,EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';





export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const[show,setShow]=useState(false);
  const[emailError,setEmailError]=useState(false);

  const[forgotPassword,setForgotPassword]=useState(false);

function handleForgotPassword(email) {

  if(!email.trim()){
    setEmailError(true);
    
    return;
  }
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      setForgotPassword(true);
      setEmailError(false);
     
    })
    .catch((error) => {
      setEmailError(true);
      
     
    });
}


  const handleLogin = async () => {
   try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("User Info:", result.user);

    
   } catch (error) {
    console.error("Error during login:", error);
    
   }
  };

  const handleGoogleAuth = async () => {
  try {   
        const result = await signInWithRedirect(auth, provider);
        console.log("User Info:", result.user);
    } catch (error) {
        console.error("Error during login:",error);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
          <div className="flex items-center justify-center mb-2">
            <Code className="w-10 h-10 mr-2" />
            <h1 className="text-3xl font-bold">Code Tester</h1>
          </div>
          <p className="text-green-100">Welcome back! Please login to continue</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to Your Account</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {emailError?<div  className="text-red-500 text-sm mb-4">Enter valid email</div>:null}
         

            {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={show?'text':'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
              <div className="absolute right-3 top-3 cursor-pointer" onClick={()=>setShow(!show)}>
                {show ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </div>
            </div>
          </div>

          {forgotPassword?<div className="text-green-600 text-sm mb-4">Password reset email sent! Check your inbox.</div>:null}

          <div className="text-right mb-6">
            <button className="text-sm text-green-600 hover:text-green-700 font-medium" onClick={() => handleForgotPassword(email)}>
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 shadow-md mb-4"
          >
            Login
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-green-500 mb-6"
          >
            {/* Google Icon */}
            <img src="./public/google.png" className='w-7 h-7' alt="Google" />
            Continue with Google
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don’t have an account?{' '}
             <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">Create Account</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
