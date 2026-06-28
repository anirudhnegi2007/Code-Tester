import axios from 'axios';

import { useState } from 'react';
import { Mail, Lock, User, Code, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase/config';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_backend_URL;

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

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Auto redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return unsubscribe;
  }, [navigate]);


  const handleRegister = async () => {
    if (password !== confirmPassword) {

      setPasswordError("Passwords do not match");

      return;
    }

    if (!name.trim()) {
      setNameError(true);
      return;
    }
    if (!email.trim()) {
      setEmailError("Enter a valid email");
      return;
    }




    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await saveToBackend(userCredential.user);
      navigate("/login");

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("This email is already registered");
      }
      if (error.code === "auth/invalid-email") {
        setEmailError("Enter a valid email");
      }
    }


  };

  const handleGoogleAuth = async () => {
    try {
      //  const result = await signInWithRedirect(auth, provider);  it need to fix the bug of not regesting the user in database after google auth
      const result = await signInWithPopup(auth, provider);

      await saveToBackend(result.user);
      navigate("/login");
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
        <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider mt-2">Create an account to start practicing</p>
      </div>

      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-[#30363d] pb-4 font-mono">CREATE ACCOUNT</h2>

        <div className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-[#8b949e] text-xs font-mono font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-[#6e7681] group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError('') }}
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-green-500/80 text-[#e6edf3] placeholder-[#484f58] pl-11 pr-4 py-3 rounded-lg focus:outline-none transition-all duration-200 text-sm font-sans"
                placeholder="John Doe"
              />
            </div>
            {nameError && <p className="text-red-400 text-xs font-mono">Full name is required.</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[#8b949e] text-xs font-mono font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#6e7681] group-focus-within:text-green-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-green-500/80 text-[#e6edf3] placeholder-[#484f58] pl-11 pr-4 py-3 rounded-lg focus:outline-none transition-all duration-200 text-sm font-sans"
                placeholder="you@example.com"
              />
            </div>
            {emailError && <p className="text-red-400 text-xs font-mono">{emailError}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[#8b949e] text-xs font-mono font-bold uppercase tracking-wider">Password</label>
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
            {passwordError && <p className="text-red-400 text-xs font-mono">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-[#8b949e] text-xs font-mono font-bold uppercase tracking-wider">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#6e7681] group-focus-within:text-green-500 transition-colors" />
              <input
                type={show ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-green-500/80 text-[#e6edf3] placeholder-[#484f58] pl-11 pr-12 py-3 rounded-lg focus:outline-none transition-all duration-200 text-sm font-sans"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleRegister}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-lg transition-all duration-200 text-sm font-mono uppercase tracking-wider mt-4"
          >
            Create Account
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
            Already have an account?{' '}
            <Link to="/login" className="text-green-500 hover:text-green-400 font-bold transition-colors">Login</Link>
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
