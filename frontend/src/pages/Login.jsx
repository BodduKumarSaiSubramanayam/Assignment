import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email format');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#f9f8f4]">
      <div className="bg-white p-10 rounded-sm shadow-sm max-w-md w-full border border-[#e5e1d5]">
        <div className="flex justify-center mb-8">
            {/* Minimalist Logo Placeholder */}
            <div className="w-12 h-12 border border-[#c2a46b] rounded-full flex items-center justify-center text-[#c2a46b] font-serif text-xl italic">
                A
            </div>
        </div>
        <h2 className="text-3xl font-serif font-light text-center text-[#333] mb-2 uppercase tracking-widest">Welcome Back</h2>
        <p className="text-center text-[#666] mb-10 font-light text-sm italic">Enter your credentials to access your portal.</p>
        
        {error && (
            <div className="bg-[#fff5f5] text-[#c53030] p-3 rounded-sm mb-6 text-xs uppercase tracking-tight border border-[#fed7d7]">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#666] mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-[#e5e1d5] rounded-none focus:border-[#c2a46b] outline-none transition-colors text-sm font-light placeholder:italic"
              placeholder="ritual@aetheria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#666] mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-[#e5e1d5] rounded-none focus:border-[#c2a46b] outline-none transition-colors text-sm font-light placeholder:italic"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#c2a46b] hover:bg-[#b59458] text-white font-medium py-4 rounded-none transition duration-300 flex justify-center items-center uppercase text-[11px] tracking-[0.3em]"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-10 text-center text-[11px] text-[#888] font-light">
          New to itzfizz? <Link to="/register" className="text-[#333] hover:text-[#c2a46b] font-medium underline underline-offset-4 decoration-[#e5e1d5] transition-all">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
