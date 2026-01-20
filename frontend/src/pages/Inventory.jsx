import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Search } from 'lucide-react';

const Inventory = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const limit = 10;

    useEffect(() => {
        fetchInventory();
    }, [page, searchTerm]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/inventory_table`, {
                params: {
                    page,
                    limit,
                    product_id: searchTerm || undefined
                }
            });
            setData(res.data.data);
            setTotal(res.data.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching inventory", error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Product ID..."
                        className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-200 uppercase bg-slate-900/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Product ID</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Region</th>
                                    <th className="px-6 py-4 text-right">Inventory</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                    <th className="px-6 py-4 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">{new Date(item.Date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-medium text-white">{item['Product ID']}</td>
                                            <td className="px-6 py-4">{item.Category}</td>
                                            <td className="px-6 py-4">{item.Region}</td>
                                            <td className="px-6 py-4 text-right text-emerald-400">{item['Inventory Level']}</td>
                                            <td className="px-6 py-4 text-right">{item['Units Sold']}</td>
                                            <td className="px-6 py-4 text-right">${item.Price}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4 border-t border-slate-700">
                        <span className="text-sm text-slate-400">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700 transition"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page * limit >= total}
                                className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Inventory;
