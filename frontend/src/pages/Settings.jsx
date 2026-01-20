import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Save, RefreshCw, Upload, Bell, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const [retraining, setRetraining] = useState(false);

    const handleRetrain = () => {
        setRetraining(true);
        setTimeout(() => setRetraining(false), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">System Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Model Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database size={20} className="text-primary" />
                            Model Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                            <div>
                                <h4 className="text-white font-medium">Automatic Retraining</h4>
                                <p className="text-sm text-slate-400">Retrain forecast models when new data arrives</p>
                            </div>
                            <ToggleSwitch />
                        </div>

                        <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                            <div>
                                <h4 className="text-white font-medium">Forecast Horizon</h4>
                                <p className="text-sm text-slate-400">Number of days to predict into the future</p>
                            </div>
                            <select className="bg-slate-950 border border-slate-700 text-white px-3 py-1 rounded-lg">
                                <option>7 Days</option>
                                <option>14 Days</option>
                                <option>30 Days</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleRetrain}
                                disabled={retraining}
                                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg border border-slate-700 transition"
                            >
                                <RefreshCw size={18} className={retraining ? "animate-spin" : ""} />
                                {retraining ? "Retraining Models..." : "Manually Retrain Models"}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload size={20} className="text-accent" />
                            Data Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-primary/50 transition cursor-pointer bg-slate-900/50">
                            <Upload size={32} className="mx-auto text-slate-500 mb-2" />
                            <h4 className="text-white font-medium">Upload Dataset</h4>
                            <p className="text-sm text-slate-400 mt-1">Drag & drop CSV or Excel files here</p>
                            <button className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg">Select File</button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell size={20} className="text-warning" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">Low Stock Alerts</span>
                            <ToggleSwitch defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">Forecast Anomalies</span>
                            <ToggleSwitch defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">Weekly Email Reports</span>
                            <ToggleSwitch />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-6 py-2 rounded-lg text-slate-400 hover:text-white transition">Cancel</button>
                <button className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </div>
    );
};

const ToggleSwitch = ({ defaultChecked }) => {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <button
            onClick={() => setChecked(!checked)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-primary' : 'bg-slate-700'}`}
        >
            <motion.div
                className="w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ x: checked ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    )
}

export default Settings;
