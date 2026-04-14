import axios from 'axios';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect,sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { auth,provider } from '../../firebase/config';

const API_URL = import.meta.env.VITE_backend_URL;



import { useState } from 'react';
import { Mail, Lock, Code ,Eye,EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

 const  saveToBackend  =async (user) => {
  try {
    const token = await user.getIdToken();
    await axios.post(`${API_URL}/api/user/save`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error("Error saving user to backend:", err);
  }
};


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
  
    await saveToBackend(result.user);

    
   } catch (error) {
    console.error("Error during login:", error);
    
   }
  };

  const handleGoogleAuth = async () => {
  try {   
        // const result = await signInWithRedirect(auth, provider);  it need to fix the bug of not regesting the user in database after google auth
        const result = await signInWithPopup(auth, provider);
       
         await saveToBackend(result.user);
    } catch (error) {
        console.error("Error during login:",error);
    }

  };

  return (
    <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-6 font-sans text-[#e6edf3]">
     <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

        {/* Dark Header */}
        <div className="bg-[#161b22] border-b border-[#30363d] p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#39d353] rounded-full flex items-center justify-center">
              <Code className="w-6 h-6 text-[#080c10]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight " style={{ fontFamily: 'var(--font-mono)' }}>Code_Tester</h1>
          </div>
          <p className="text-[#8b949e]">Welcome back! Sign in to continue</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Login to Your Account</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
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
            <label className="block text-gray-200 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
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


// import axios from 'axios';
// import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import React, { useState } from 'react';
// import { auth, provider } from '../../firebase/config';
// import { Mail, Lock, Eye, EyeOff, Code2 } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const API_URL = import.meta.env.VITE_backend_URL;

// const saveToBackend = async (user) => {
//   try {
//     const token = await user.getIdToken();
//     await axios.post(`${API_URL}/api/user/save`, {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//   } catch (err) {
//     console.error("Error saving user to backend:", err);
//   }
// };

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleForgotPassword = async () => {
//     if (!email.trim()) {
//       setEmailError(true);
//       return;
//     }
//     try {
//       await sendPasswordResetEmail(auth, email);   // Make sure to import sendPasswordResetEmail
//       setResetSent(true);
//       setEmailError(false);
//     } catch (error) {
//       setEmailError(true);
//     }
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       await saveToBackend(result.user);
//       // Redirect or show success (you can add toast here if needed)
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Invalid email or password");   // Replace with better error UI later
//     }
//     setLoading(false);
//   };

//   const handleGoogleAuth = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       await saveToBackend(result.user);
//     } catch (error) {
//       console.error("Google login error:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#080c10] text-[#e6edf3] flex items-center justify-center p-6 font-sans">
//       <div className="w-full max-w-md">
//         {/* Logo + Header */}
//         <div className="flex flex-col items-center mb-10">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-9 h-9 bg-[#39d353] rounded-full flex items-center justify-center">
//               <Code2 className="w-5 h-5 text-[#080c10]" />
//             </div>
//             <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>
//               Code_Tester
//             </h1>
//           </div>
//           <p className="text-[#8b949e] text-center">Sign in to continue to your coding interviews</p>
//         </div>

//         {/* Login Card */}
//         <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 shadow-2xl">
//           <h2 className="text-2xl font-semibold mb-8 text-center">Welcome back</h2>

//           {/* Email */}
//           <div className="mb-5">
//             <label className="block text-[#8b949e] text-sm mb-2 font-mono">EMAIL ADDRESS</label>
//             <div className="relative">
//               <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#6e7681]" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#39d353] rounded-lg pl-11 py-3 text-[#e6edf3] placeholder-[#6e7681] focus:outline-none"
//                 placeholder="you@example.com"
//               />
//             </div>
//           </div>

//           {emailError && <p className="text-[#ff7b72] text-sm mb-4">Please enter a valid email</p>}

//           {/* Password */}
//           <div className="mb-6">
//             <label className="block text-[#8b949e] text-sm mb-2 font-mono">PASSWORD</label>
//             <div className="relative">
//               <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#6e7681]" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#39d353] rounded-lg pl-11 pr-12 py-3 text-[#e6edf3] placeholder-[#6e7681] focus:outline-none"
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-3.5 text-[#6e7681] hover:text-[#e6edf3]"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Forgot Password */}
//           <div className="text-right mb-6">
//             <button
//               onClick={handleForgotPassword}
//               className="text-[#79c0ff] hover:text-[#58a6ff] text-sm transition-colors"
//             >
//               Forgot password?
//             </button>
//           </div>

//           {resetSent && (
//             <p className="text-[#39d353] text-sm mb-4 text-center">
//               Password reset email sent! Check your inbox.
//             </p>
//           )}

//           {/* Login Button */}
//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className="w-full bg-[#39d353] hover:bg-[#5bdf6b] text-[#080c10] font-semibold py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>

//           {/* Divider */}
//           <div className="flex items-center my-8">
//             <div className="flex-1 h-px bg-[#30363d]"></div>
//             <span className="px-6 text-[#6e7681] text-sm font-mono">OR</span>
//             <div className="flex-1 h-px bg-[#30363d]"></div>
//           </div>

//           {/* Google Button */}
//           <button
//             onClick={handleGoogleAuth}
//             className="w-full flex items-center justify-center gap-3 bg-[#161b22] border border-[#30363d] hover:border-[#484f58] text-[#e6edf3] py-3.5 rounded-lg font-medium transition-all"
//           >
//             <img src="/google.png" alt="Google" className="w-5 h-5" />
//             Continue with Google
//           </button>

//           {/* Sign Up Link */}
//           <p className="text-center mt-8 text-[#8b949e]">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-[#39d353] hover:text-[#5bdf6b] font-medium">
//               Create one now
//             </Link>
//           </p>
//         </div>

//         {/* Footer note */}
//         <p className="text-center text-[#6e7681] text-xs mt-8">
//           Built for engineers, by engineers © Code_Tester
//         </p>
//       </div>
//     </div>
//   );
//}