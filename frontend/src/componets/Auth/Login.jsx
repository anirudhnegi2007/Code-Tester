import axios from 'axios';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { auth, provider } from '../../firebase/config';

const API_URL = import.meta.env.VITE_backend_URL;



import { useState, useEffect } from 'react';
import { Mail, Lock, Code, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const saveToBackend = async (user) => {
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
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [forgotPassword, setForgotPassword] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return unsubscribe;
  }, [navigate]);

  function handleForgotPassword(email) {

    if (!email.trim()) {
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
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during login:", error);

    }
  };

  const handleGoogleAuth = async () => {
    try {
      // const result = await signInWithRedirect(auth, provider);  it need to fix the bug of not regesting the user in database after google auth
      const result = await signInWithPopup(auth, provider);

      await saveToBackend(result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during login:", error);
    }

  };

  return (
    <div className="min-h-screen bg-[#080c10] flex flex-col items-center justify-center p-6 font-sans text-[#e6edf3] relative">
      
      {/* Header / Logo */}
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="flex items-center gap-2.5 font-mono font-bold text-xl text-white hover:opacity-80 transition-opacity">
          <span className="w-3 h-3 bg-green-500 rounded-full" />
          Code_Tester
        </Link>
        <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider mt-2">Sign in to your coding workspace</p>
      </div>

      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-[#30363d] pb-4 font-mono">WELCOME BACK</h2>

        <div className="space-y-4">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[#8b949e] text-xs font-mono font-bold uppercase tracking-wider">EMAIL ADDRESS</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#6e7681] group-focus-within:text-green-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-green-500/80 text-[#e6edf3] placeholder-[#484f58] pl-11 pr-4 py-3 rounded-lg focus:outline-none transition-all duration-200 text-sm font-sans"
                placeholder="you@example.com"
              />
            </div>
            {emailError && <p className="text-red-400 text-xs font-mono">Please enter a valid email address.</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[#8b949e] text-xs font-mono font-bold uppercase tracking-wider">PASSWORD</label>
              <button 
                type="button" 
                className="text-xs text-green-500 hover:text-green-400 transition-colors font-mono" 
                onClick={() => handleForgotPassword(email)}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#6e7681] group-focus-within:text-green-500 transition-colors" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-green-500/80 text-[#e6edf3] placeholder-[#484f58] pl-11 pr-12 py-3 rounded-lg focus:outline-none transition-all duration-200 text-sm font-sans"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-4 top-3.5 text-[#6e7681] hover:text-[#e6edf3] transition-colors" 
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {forgotPassword && <p className="text-green-400 text-xs font-mono">Password reset email sent! Check your inbox.</p>}
          </div>

          {/* Action button */}
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-lg transition-all duration-200 text-sm font-mono uppercase tracking-wider mt-2"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center py-2">
            <div className="flex-1 h-px bg-[#30363d]"></div>
            <span className="px-4 text-[#6e7681] text-xs font-mono">OR</span>
            <div className="flex-1 h-px bg-[#30363d]"></div>
          </div>

          {/* Google SSO */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2 bg-[#161b22] border border-[#30363d] hover:border-[#484f58] hover:bg-[#1c2128] text-[#e6edf3] py-3 rounded-lg font-semibold transition-all duration-200 text-sm font-mono"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15 0 12 0 7.35 0 3.39 2.67 1.43 6.56l3.86 3C6.23 6.95 8.9 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.47-1.11 2.71-2.36 3.56l3.64 2.82c2.13-1.97 3.78-4.87 3.78-8.53z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.59c-.25-.74-.39-1.53-.39-2.35 0-.82.14-1.61.39-2.35L1.43 6.56C.52 8.38 0 10.38 0 12.5s.52 4.12 1.43 5.94l3.86-3.03z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.07 7.96-2.92l-3.64-2.82c-1.01.68-2.3 1.08-4.32 1.08-3.1 0-5.77-1.91-6.71-4.52l-3.86 3.03C3.39 21.33 7.35 24 12 24z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer Navigation */}
          <p className="text-center text-[#8b949e] text-xs mt-6">
            Don’t have an account?{' '}
            <Link to="/register" className="text-green-500 hover:text-green-400 font-bold transition-colors">Create one now</Link>
          </p>

        </div>
      </div>
      
      {/* Footer copyright */}
      <p className="text-center text-[#6e7681] text-[10px] font-mono mt-8">
        Built for engineers, by engineers © Code_Tester
      </p>
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