import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardMetrics } from '../../types/inventory';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';

export function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: currentData } = await supabase
        .from('inventory_data')
        .select('*')
        .gte('date', weekAgo)
        .lte('date', today);

      const { data: previousData } = await supabase
        .from('inventory_data')
        .select('*')
        .gte('date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .lt('date', weekAgo);

      if (currentData && previousData) {
        const currentRevenue = currentData.reduce((sum, item) => sum + Number(item.revenue), 0);
        const previousRevenue = previousData.reduce((sum, item) => sum + Number(item.revenue), 0);
        const currentUnitsSold = currentData.reduce((sum, item) => sum + Number(item.units_sold), 0);
        const previousUnitsSold = previousData.reduce((sum, item) => sum + Number(item.units_sold), 0);

        const { count: alertsCount } = await supabase
          .from('inventory_data')
          .select('*', { count: 'exact', head: true })
          .eq('reorder_alert', true)
          .gte('date', weekAgo);

        setMetrics({
          total_revenue: currentRevenue,
          total_units_sold: currentUnitsSold,
          avg_inventory_level: currentData.length > 0
            ? currentData.reduce((sum, item) => sum + Number(item.inventory_level), 0) / currentData.length
            : 0,
          inventory_turnover_rate: currentData.length > 0
            ? currentData.reduce((sum, item) => sum + Number(item.inventory_turnover), 0) / currentData.length
            : 0,
          reorder_alerts_count: alertsCount || 0,
          revenue_change: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
          units_sold_change: previousUnitsSold > 0 ? ((currentUnitsSold - previousUnitsSold) / previousUnitsSold) * 100 : 0,
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Real-time warehouse metrics and KPIs</p>
        </div>
        <button
          onClick={fetchMetrics}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics?.total_revenue.toFixed(2) || '0.00'}`}
          change={metrics?.revenue_change || 0}
          icon={DollarSign}
          iconColor="bg-green-500"
        />
        <MetricCard
          title="Units Sold"
          value={metrics?.total_units_sold.toFixed(0) || '0'}
          change={metrics?.units_sold_change || 0}
          icon={Package}
          iconColor="bg-blue-500"
        />
        <MetricCard
          title="Avg Inventory Level"
          value={metrics?.avg_inventory_level.toFixed(0) || '0'}
          icon={Package}
          iconColor="bg-purple-500"
        />
        <MetricCard
          title="Reorder Alerts"
          value={metrics?.reorder_alerts_count.toString() || '0'}
          icon={AlertTriangle}
          iconColor="bg-orange-500"
          alert={metrics && metrics.reorder_alerts_count > 0}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Insights</h2>
        <div className="space-y-4">
          <InsightCard
            title="Inventory Turnover Rate"
            value={`${metrics?.inventory_turnover_rate.toFixed(2) || '0.00'}x`}
            description="Average rate at which inventory is sold and replaced"
          />
          <InsightCard
            title="Revenue Trend"
            value={`${metrics?.revenue_change.toFixed(1) || '0.0'}%`}
            description="Compared to previous week"
            trend={metrics && metrics.revenue_change > 0 ? 'up' : 'down'}
          />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  alert?: boolean;
}

function MetricCard({ title, value, change, icon: Icon, iconColor, alert }: MetricCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${alert ? 'border-orange-300' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down';
}

function InsightCard({ title, value, description, trend }: InsightCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend && (
          trend === 'up' ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />
        )}
      </div>
    </div>
  );
}
