import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Forecast = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/demand_forecast');
                setChartData(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Demand Forecast</h1>
            <Card>
                <CardHeader>
                    <CardTitle>AI Demand Prediction Model</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="h-[500px] flex items-center justify-center text-slate-400">Running ML Model...</div>
                    ) : (
                        <Plot
                            data={chartData.data}
                            layout={{
                                ...chartData.layout,
                                height: 500,
                                autosize: true,
                                paper_bgcolor: 'rgba(0,0,0,0)',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                                font: { color: '#94a3b8' },
                                xaxis: { ...chartData.layout.xaxis, gridcolor: '#334155' },
                                yaxis: { ...chartData.layout.yaxis, gridcolor: '#334155' },
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%' }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Forecast;
