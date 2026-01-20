import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { FileText, Download, Printer, Share2 } from 'lucide-react';

const Reports = () => {
    const reports = [
        { id: 1, name: "Monthly Inventory Summary", date: "2024-03-01", type: "PDF", size: "2.4 MB" },
        { id: 2, name: "Stock-out Risk Analysis", date: "2024-02-28", type: "XLSX", size: "1.1 MB" },
        { id: 3, name: "Q1 Sales Forecast", date: "2024-02-15", type: "PDF", size: "3.8 MB" },
        { id: 4, name: "Supplier Performance", date: "2024-02-01", type: "CSV", size: "856 KB" },
        { id: 5, name: "Inventory Turnover Report", date: "2024-01-15", type: "PDF", size: "1.9 MB" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Reports Center</h1>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-700 transition">
                        <Printer size={18} /> Print
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                        <Share2 size={18} /> Share Report
                    </button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Report Name</th>
                                    <th className="px-6 py-4">Generated Date</th>
                                    <th className="px-6 py-4">Format</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded text-primary">
                                                <FileText size={18} />
                                            </div>
                                            <span className="font-medium text-white">{report.name}</span>
                                        </td>
                                        <td className="px-6 py-4">{report.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-slate-800 text-xs font-mono border border-slate-700">
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{report.size}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-primary transition p-2 hover:bg-slate-800 rounded-full">
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
