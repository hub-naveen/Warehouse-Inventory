import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';

const Performance = () => {
    const [data, setData] = useState({
        actualVsPred: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dashboardService.getActualVsPredicted();
                setData({ actualVsPred: res.data });
            } catch (error) {
                console.error("Error fetching performance data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h1 style={{ marginBottom: '2rem' }}>Model Performance Analytics</h1>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Best Model</div>
                    <div className="kpi-value" style={{ color: 'var(--success)' }}>XGBoost</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">R² Score</div>
                    <div className="kpi-value">0.999</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">MAPE</div>
                    <div className="kpi-value">2.71%</div>
                </div>
            </div>

            <div className="chart-card glassmorphism" style={{ height: '600px' }}>
                <h3>Actual vs Predicted Analysis</h3>
                {data.actualVsPred && (
                    <Plot
                        data={data.actualVsPred.data}
                        layout={{
                            ...data.actualVsPred.layout,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'transparent',
                            font: { color: '#fff' },
                            height: 500
                        }}
                        style={{ width: '100%' }}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default Performance;
