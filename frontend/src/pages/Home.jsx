import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    const [forecastChart, setForecastChart] = useState(null);
    const [inventoryGauge, setInventoryGauge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const kpiRes = await axios.get('http://localhost:8000/dashboard_kpis');
                setKpis(kpiRes.data);

                const forecastRes = await axios.get('http://localhost:8000/api/visualizations/forecast');
                setForecastChart(forecastRes.data);

                const gaugeRes = await axios.get('http://localhost:8000/api/visualizations/inventory_health');
                setInventoryGauge(gaugeRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-white flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <div className="text-sm text-slate-400">Last updated: Just now</div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={itemVariants}><KpiCard title="Total Revenue" value={kpis?.total_revenue} icon={<DollarSign className="text-emerald-400" />} /></motion.div>
                <motion.div variants={itemVariants}><KpiCard title="Units Sold" value={kpis?.total_units_sold} icon={<TrendingUp className="text-blue-400" />} /></motion.div>
                <motion.div variants={itemVariants}><KpiCard title="Low Stock Items" value={kpis?.low_stock_count} icon={<AlertTriangle className="text-red-400" />} /></motion.div>
                <motion.div variants={itemVariants}><KpiCard title="Active Products" value={kpis?.active_products} icon={<Package className="text-purple-400" />} /></motion.div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {forecastChart && (
                                <Plot
                                    data={forecastChart.data}
                                    layout={{ ...forecastChart.layout, width: undefined, height: 350, autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: '#94a3b8' } }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory Health</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center">
                            {inventoryGauge && (
                                <Plot
                                    data={inventoryGauge.data}
                                    layout={{ ...inventoryGauge.layout, width: undefined, height: 350, autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: '#94a3b8' } }}
                                    config={{ responsive: true, displayModeBar: false }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

const KpiCard = ({ title, value, icon }) => (
    <Card className="hover:border-primary/50 transition-colors cursor-default">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <div className="text-2xl font-bold mt-1 text-white">{value}</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                {icon}
            </div>
        </CardContent>
    </Card>
);

export default Dashboard;
