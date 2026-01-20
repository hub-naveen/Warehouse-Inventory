import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

const Optimization = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await axios.get('http://localhost:8000/optimization_recommendation');
                setRecommendations(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchRecs();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Inventory Optimization</h1>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>EOQ & ROP Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-200 uppercase bg-slate-900/50 border-b border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Current Stock</th>
                                        <th className="px-6 py-4">EOQ (Optimal Order)</th>
                                        <th className="px-6 py-4">ROP (Reorder Point)</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center py-4">Calculating Optimization...</td></tr>
                                    ) : (
                                        recommendations.slice(0, 20).map((item, i) => (
                                            <tr key={i} className="border-b border-slate-800">
                                                <td className="px-6 py-4 font-medium text-white">{item['Product ID']}</td>
                                                <td className="px-6 py-4">{item['Current Stock']}</td>
                                                <td className="px-6 py-4 text-blue-400">{item.EOQ}</td>
                                                <td className="px-6 py-4 text-yellow-400">{item.ROP}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.Status === 'Reorder Now' ? 'bg-red-500/20 text-red-400' :
                                                            item.Status === 'Overstocked' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-green-500/20 text-green-400'
                                                        }`}>
                                                        {item.Status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.Status === 'Reorder Now' && (
                                                        <button className="text-xs bg-primary text-black px-3 py-1 rounded hover:bg-primary/80 font-bold">
                                                            Order {item.EOQ} Units
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Optimization;
