import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    TrendingUp,
    Package,
    BarChart3,
    Map,
    Settings,
    Home,
    Database,
    Cpu,
    Info,
    ShoppingCart,
    FileText
} from 'lucide-react';
import { cn } from "../lib/utils";

const Sidebar = () => {
    const links = [
        { to: "/", icon: <Home size={20} />, label: "Home" },
        { to: "/overview", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { to: "/inventory", icon: <Package size={20} />, label: "Inventory" },
        { to: "/forecast", icon: <TrendingUp size={20} />, label: "Forecast" },
        { to: "/optimization", icon: <ShoppingCart size={20} />, label: "Optimization" },
        { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
        { to: "/regional", icon: <Map size={20} />, label: "Regional" },
        { to: "/reports", icon: <FileText size={20} />, label: "Reports" },
        { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700 h-screen fixed top-0 left-0 z-50">
            <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <Package size={24} className="text-primary" />
                </div>
                <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">InvOptima</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-800/50",
                                    isActive ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_rgba(56,189,248,0.3)]" : "text-slate-400 hover:text-white"
                                )}
                            >
                                <span className={({ isActive }) => cn("transition-colors", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")}>
                                    {link.icon}
                                </span>
                                <span className="font-medium">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700/50">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400">SYSTEM ONLINE</span>
                    </div>
                    <p className="text-xs text-slate-500">v1.2.0 • InvOptima</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
