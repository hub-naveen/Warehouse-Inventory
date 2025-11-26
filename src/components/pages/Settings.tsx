import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your preferences and system configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingCard
          icon={Bell}
          title="Notification Preferences"
          description="Configure how you receive alerts and updates"
          iconColor="bg-blue-500"
        >
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Reorder alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Anomaly detection</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Daily forecasts</span>
            </label>
          </div>
        </SettingCard>

        <SettingCard
          icon={Shield}
          title="Security"
          description="Manage your account security settings"
          iconColor="bg-green-500"
        >
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition">
              Change password
            </button>
            <button className="w-full text-left px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition">
              Enable two-factor authentication
            </button>
          </div>
        </SettingCard>

        <SettingCard
          icon={Database}
          title="Data Sync"
          description="Configure model data synchronization"
          iconColor="bg-purple-500"
        >
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Auto-sync predictions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Real-time updates</span>
            </label>
          </div>
        </SettingCard>

        <SettingCard
          icon={SettingsIcon}
          title="Display"
          description="Customize your dashboard appearance"
          iconColor="bg-orange-500"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Theme</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

interface SettingCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconColor: string;
  children: React.ReactNode;
}

function SettingCard({ icon: Icon, title, description, iconColor, children }: SettingCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
