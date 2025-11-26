import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface TimeSeriesData {
  date: string;
  units_sold: number;
  predicted_units_sold: number;
  revenue: number;
  inventory_level: number;
}

export function Analytics() {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(timeRange);
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: rawData, error } = await supabase
        .from('inventory_data')
        .select('date, units_sold, predicted_units_sold, revenue, inventory_level')
        .gte('date', startDate)
        .order('date', { ascending: true });

      if (error) throw error;

      const aggregated = rawData?.reduce((acc: { [key: string]: TimeSeriesData }, item) => {
        const date = item.date;
        if (!acc[date]) {
          acc[date] = {
            date,
            units_sold: 0,
            predicted_units_sold: 0,
            revenue: 0,
            inventory_level: 0,
          };
        }
        acc[date].units_sold += Number(item.units_sold);
        acc[date].predicted_units_sold += Number(item.predicted_units_sold);
        acc[date].revenue += Number(item.revenue);
        acc[date].inventory_level += Number(item.inventory_level);
        return acc;
      }, {});

      setData(Object.values(aggregated || {}));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.units_sold, d.predicted_units_sold)));
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxInventory = Math.max(...data.map(d => d.inventory_level));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Forecasts</h1>
          <p className="text-slate-600 mt-1">ML-powered insights and trend analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Units Sold: Actual vs Predicted</h2>
        <div className="relative h-64">
          {data.length > 0 ? (
            <div className="flex items-end justify-between h-full gap-1">
              {data.map((item, index) => {
                const actualHeight = (item.units_sold / maxValue) * 100;
                const predictedHeight = (item.predicted_units_sold / maxValue) * 100;
                const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="w-full flex gap-0.5 items-end h-48">
                      <div
                        className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer relative"
                        style={{ height: `${actualHeight}%` }}
                        title={`Actual: ${item.units_sold.toFixed(0)}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-semibold">{item.units_sold.toFixed(0)}</span>
                        </div>
                      </div>
                      <div
                        className="flex-1 bg-cyan-400 rounded-t hover:bg-cyan-500 transition-all cursor-pointer relative"
                        style={{ height: `${predictedHeight}%` }}
                        title={`Predicted: ${item.predicted_units_sold.toFixed(0)}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-semibold">{item.predicted_units_sold.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 mt-2 rotate-0">{date}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-600">No data available</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-700">Actual Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-400 rounded"></div>
            <span className="text-sm text-slate-700">Predicted Sales</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Trend</h2>
          <div className="relative h-48">
            {data.length > 0 ? (
              <div className="flex items-end justify-between h-full gap-2">
                {data.map((item, index) => {
                  const height = (item.revenue / maxRevenue) * 100;
                  const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-all cursor-pointer relative"
                        style={{ height: `${height}%` }}
                        title={`Revenue: $${item.revenue.toFixed(2)}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-semibold">${item.revenue.toFixed(0)}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 mt-2">{date}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-600">No data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Inventory Level Trend</h2>
          <div className="relative h-48">
            {data.length > 0 ? (
              <div className="flex items-end justify-between h-full gap-2">
                {data.map((item, index) => {
                  const height = (item.inventory_level / maxInventory) * 100;
                  const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div
                        className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-all cursor-pointer relative"
                        style={{ height: `${height}%` }}
                        title={`Inventory: ${item.inventory_level.toFixed(0)}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-semibold">{item.inventory_level.toFixed(0)}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 mt-2">{date}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-600">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-2">ML Model Performance</h3>
            <p className="text-sm text-slate-700 mb-3">
              The LightGBM regression model was trained on historical warehouse data with the following features:
            </p>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Demand Forecast, Price, Units Ordered, Inventory Level</li>
              <li>• Temporal features: Year, Month, Day of Week</li>
              <li>• Categorical features: Category, Region, Weather, Seasonality</li>
              <li>• Engineered features: Stock Movement, Inventory Turnover</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
