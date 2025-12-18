'use client';

import { useState } from 'react';

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    minWithdrawal: 10,
    minDeposit: 10,
    minTrade: 500,
    tradingFee: 0.1,
    withdrawalFee: 2,
    maintenanceMode: false,
  });

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        <h3 className="text-lg font-semibold text-white mb-6">Platform Settings</h3>
        
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-sm text-yellow-400 mb-3">If you see old data or errors, clear the cache:</p>
          <button
            onClick={() => {
              if (confirm('Clear all cached data? This will reset currency pairs to defaults.')) {
                localStorage.removeItem('admin-storage');
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
          >
            Clear Cache & Reload
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Minimum Withdrawal ($)</label>
            <input
              type="number"
              value={settings.minWithdrawal}
              onChange={(e) => setSettings({ ...settings, minWithdrawal: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Minimum Deposit ($)</label>
            <input
              type="number"
              value={settings.minDeposit}
              onChange={(e) => setSettings({ ...settings, minDeposit: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Minimum Trade Amount ($)</label>
            <input
              type="number"
              value={settings.minTrade}
              onChange={(e) => setSettings({ ...settings, minTrade: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Trading Fee (%)</label>
            <input
              type="number"
              step="0.01"
              value={settings.tradingFee}
              onChange={(e) => setSettings({ ...settings, tradingFee: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Withdrawal Fee ($)</label>
            <input
              type="number"
              value={settings.withdrawalFee}
              onChange={(e) => setSettings({ ...settings, withdrawalFee: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Maintenance Mode</p>
              <p className="text-xs text-gray-400">Disable user trading temporarily</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
