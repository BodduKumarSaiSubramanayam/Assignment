import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Users, CheckCircle, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', status: 'New' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://assignment-backend-8wsa.onrender.com';
  const token = localStorage.getItem('token');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
         });
        setData(res.data);
        await fetchLeads();
      } catch (err) {
        setError('Failed to fetch sanctuary data.');
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate, logout]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateEmail(form.email)) {
      setFormError('PLEASE PROVIDE A VALID EMAIL ADDRESS.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/leads/${isEditing}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/leads`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: '', email: '', status: 'New' });
      setIsEditing(null);
      await fetchLeads();
    } catch (err) {
      console.error('Save failed:', err);
      const msg = err.response?.data?.message || err.message || 'SOMETHING WENT WRONG. PLEASE TRY AGAIN.';
      setFormError(msg.toUpperCase());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (lead) => {
    setIsEditing(lead._id);
    setForm({ name: lead.name, email: lead.email, status: lead.status });
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this lead?')) return;
    try {
      await axios.delete(`${API_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchLeads();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (authLoading || loading) {
    return <div className="flex-1 flex items-center justify-center text-sm font-serif italic text-[#888] bg-[#f9f8f4] h-screen">Preparing your ritual sanctuary...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-[#c53030] bg-[#f9f8f4] font-light uppercase tracking-widest text-xs h-screen">{error}</div>;
  }

  return (
    <div className="flex-1 bg-[#f9f8f4] min-h-screen">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-light text-[#333] uppercase tracking-[0.2em] mb-2">{data?.message || 'Sanctuary'}</h1>
            <p className="text-[#888] font-light italic text-sm border-l border-[#c2a46b] pl-4 ml-1">Refining your workspace for focus and clarity.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 text-[#c2a46b] hover:text-[#333] font-medium transition duration-300 uppercase text-[10px] tracking-[0.3em] border-b border-transparent hover:border-[#333] pb-1"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Total Leads', val: leads.length, icon: <BarChart3 size={28} /> },
            { label: 'High Intent', val: leads.filter(l => l.status === 'Qualified').length, icon: <CheckCircle size={28} /> },
            { label: 'Active Users', val: data?.stats?.users || 1, icon: <Users size={28} /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 border border-[#e5e1d5] shadow-sm relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#c2a46b] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-5">
                <div className="text-[#c2a46b]">{stat.icon}</div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#999] mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-serif font-light text-[#333]">{stat.val}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CRUD Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Side */}
          <div className="bg-white p-8 border border-[#e5e1d5] shadow-sm self-start">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#333] mb-10 pb-4 border-b border-[#f5f2e9]">
                {isEditing ? 'Refine Lead' : 'Add New Prospect'}
            </h2>
            
            {formError && (
              <div className="mb-6 p-4 bg-[#fff5f5] border-l-2 border-[#c53030] text-[#c53030] text-[10px] uppercase tracking-widest font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#666] mb-2">Lead Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 border border-[#e5e1d5] focus:border-[#c2a46b] outline-none text-sm font-light italic"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#666] mb-2">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-4 py-3 border border-[#e5e1d5] focus:border-[#c2a46b] outline-none text-sm font-light italic"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#666] mb-2">Status</label>
                <select 
                  className="w-full px-4 py-3 border border-[#e5e1d5] focus:border-[#c2a46b] outline-none text-sm font-light italic bg-white disabled:opacity-50"
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value})}
                  disabled={isSubmitting}
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Lost</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-[#c2a46b] text-white py-4 uppercase text-[11px] tracking-[0.3em] hover:bg-[#b59458] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Processing...' : (isEditing ? 'Update Entry' : 'Create Entry')}
                </button>
                {isEditing && (
                    <button 
                      type="button" 
                      onClick={() => { setIsEditing(null); setForm({name:'', email:'', status:'New'}); setFormError(''); }} 
                      className="px-6 border border-[#e5e1d5] text-[#888] uppercase text-[10px] tracking-widest hover:bg-[#fafafa]"
                      disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
              </div>
            </form>
          </div>

          {/* List Side */}
          <div className="bg-white border border-[#e5e1d5] shadow-sm flex flex-col">
            <div className="px-8 py-6 border-b border-[#f5f2e9] bg-[#fafafa]">
              <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#333]">Prospect Directory</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px] divide-y divide-[#f5f2e9]">
              {leads.map(lead => (
                <div key={lead._id} className="p-8 hover:bg-[#fcfcfc] transition duration-300 group flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-serif font-light text-[#333] mb-1">{lead.name}</h4>
                    <p className="text-[11px] text-[#888] italic mb-2 tracking-wide">{lead.email}</p>
                    <span className={`text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 ${
                        lead.status === 'Qualified' ? 'bg-[#f0f9f3] text-[#2d6a4f]' : 
                        lead.status === 'Lost' ? 'bg-[#fff5f5] text-[#c53030]' : 
                        'bg-[#f0f4f8] text-[#4a5568]'
                    }`}>
                        {lead.status}
                    </span>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(lead)} className="text-[#c2a46b] hover:text-[#333] text-[10px] uppercase font-bold tracking-widest border-b border-[#c2a46b]">Edit</button>
                    <button onClick={() => handleDelete(lead._id)} className="text-[#c53030] hover:text-[#333] text-[10px] uppercase font-bold tracking-widest">Remove</button>
                  </div>
                </div>
              ))}
              {!leads.length && (
                <div className="p-16 text-center">
                    <p className="font-serif italic text-sm text-[#bbb]">Your directory is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
