import React from 'react';
import { motion } from 'framer-motion';
import { Package, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock login
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 bg-slate-900/40 border border-slate-700/50 rounded-2xl shadow-2xl backdrop-blur-xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary/20 p-3 rounded-xl mb-4">
                        <Package size={40} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">InvOptima</h1>
                    <p className="text-slate-400">Inventory Intelligence System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            placeholder="admin@warehouse.com"
                            defaultValue="admin@warehouse.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                                defaultValue="password"
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        Sign In
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-slate-500">
                    &copy; 2026 Warehouse Intelligence Inc. Protected by Quantum Guard.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
