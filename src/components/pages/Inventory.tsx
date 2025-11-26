import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { InventoryItem } from '../../types/inventory';
import { RefreshCw, Search, Filter, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    fetchInventory();
    fetchFilters();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('inventory_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(100);

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const { data } = await supabase
        .from('inventory_data')
        .select('category, region');

      if (data) {
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        const uniqueRegions = [...new Set(data.map(item => item.region))];
        setCategories(uniqueCategories);
        setRegions(uniqueRegions);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.store_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesRegion = filterRegion === 'all' || item.region === filterRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600 mt-1">Real-time inventory levels with ML predictions</p>
        </div>
        <button
          onClick={fetchInventory}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Store</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Inventory</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actual Sold</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Predicted</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Accuracy</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const accuracy = item.units_sold > 0
                  ? (1 - Math.abs(item.predicted_units_sold - item.units_sold) / item.units_sold) * 100
                  : 0;

                return (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.product_id}</td>
                    <td className="py-3 px-4 text-slate-600">{item.store_id}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      {item.inventory_level.toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900">
                      {item.units_sold.toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 font-medium">
                      {item.predicted_units_sold.toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.reorder_alert ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Reorder
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No inventory items found</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">ML Model Integration</h3>
          <p className="text-sm text-blue-800">
            Predictions are generated using a LightGBM model trained on historical sales data.
            The accuracy column shows how well predictions match actual sales.
          </p>
        </div>
      </div>
    </div>
  );
}
