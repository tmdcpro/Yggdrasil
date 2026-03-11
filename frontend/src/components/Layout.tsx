import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Network } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/capture', label: 'Capture', icon: PlusCircle },
  { path: '/graph', label: 'Graph', icon: Network },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-ygg-bg">
      {/* Sidebar */}
      <nav className="w-56 border-r border-ygg-border bg-ygg-bg flex flex-col">
        <div className="p-4 border-b border-ygg-border">
          <h1 className="text-lg font-bold text-ygg-accent">Yggdrasil</h1>
          <p className="text-xs text-ygg-muted mt-1">Knowledge Graph Studio</p>
        </div>
        <div className="flex-1 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-ygg-surface text-ygg-accent border-r-2 border-ygg-accent'
                    : 'text-ygg-muted hover:text-ygg-text hover:bg-ygg-surface'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-ygg-border">
          <p className="text-xs text-ygg-muted">v0.1.0-alpha</p>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
