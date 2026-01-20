import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Regional = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/analytics_charts?type=region_sales');
                setChartData(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Regional Analysis</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Sales by Region</CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData && (
                        <Plot
                            data={chartData.data}
                            layout={{ ...chartData.layout, width: undefined, height: 500, autosize: true, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: '#94a3b8' } }}
                            config={{ responsive: true }}
                            style={{ width: '100%' }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Regional;
