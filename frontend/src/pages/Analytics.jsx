import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Analytics = () => {
    const [regionChart, setRegionChart] = useState(null);
    const [categoryChart, setCategoryChart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const regionRes = await axios.get('http://localhost:8000/analytics_charts?type=region_sales');
                setRegionChart(regionRes.data);

                const catRes = await axios.get('http://localhost:8000/analytics_charts?type=category_distribution');
                setCategoryChart(catRes.data);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Visual Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Regional Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Plot
                            data={regionChart.data}
                            layout={{ ...regionChart.layout, width: undefined, height: 400, autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: '#94a3b8' } }}
                            style={{ width: '100%' }}
                            config={{ responsive: true }}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Plot
                            data={categoryChart.data}
                            layout={{ ...categoryChart.layout, width: undefined, height: 400, autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: '#94a3b8' } }}
                            style={{ width: '100%' }}
                            config={{ responsive: true }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
