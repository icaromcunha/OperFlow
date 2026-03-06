import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Database, 
  Store, 
  Share2, 
  FileText, 
  LogOut, 
  Bell, 
  Settings, 
  Search,
  Rocket,
  Moon,
  Sun,
  ChevronLeft,
  Menu,
  ShoppingBag,
  Truck,
  Package,
  Globe,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Info,
  User,
  Layers,
  Lightbulb,
  BarChart3,
  Users
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

export default function AdminLayout({ user, onLogout }: { user: any; onLogout: () => void }) {
  const { config, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "Novo Lojista", message: "Um novo lojista 'E-Shop Pro' acaba de se cadastrar.", type: "info", time: "10 min atrás" },
    { id: 2, title: "SLA Crítico", message: "Protocolo #OP-45 está chegando ao limite do SLA.", type: "alert", time: "25 min atrás" },
    { id: 3, title: "Sistema Atualizado", message: "Novas funcionalidades de relatório foram liberadas.", type: "success", time: "2 horas atrás" },
  ];

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/queue", label: "Global Queue", icon: Layers },
    { path: "/admin/clients", label: "Clients", icon: Store },
    { path: "/admin/protocols", label: "Protocols", icon: FileText },
    { path: "/admin/insights", label: "Insights", icon: Lightbulb },
    { path: "/admin/reports", label: "Reports", icon: BarChart3 },
    { path: "/admin/team", label: "Team", icon: Users },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#101622] font-sans transition-colors duration-200">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="bg-[#1E293B] dark:bg-[#0F172A] text-white flex flex-col fixed h-full z-50 transition-colors duration-200 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
              >
                <div className="size-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                  <Rocket className="text-primary size-6" />
                </div>
                <span className="font-bold text-xl tracking-tight uppercase italic">OperFlow</span>
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="size-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 mx-auto">
              <Rocket className="text-primary size-6" />
            </div>
          )}
        </div>

        <div className="px-4 mb-4">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => navigate("/admin/profile")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-slate-500 overflow-hidden border border-white/20">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white"><User size={14} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.nome}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Consultor</p>
                  </div>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ID: {user.id || '8902134'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-accent text-primary font-bold shadow-lg shadow-accent/10" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-primary shrink-0" : "text-slate-400 group-hover:text-white shrink-0"} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="px-4 mb-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={onLogout}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Sair do Portal</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div 
        initial={false}
        animate={{ marginLeft: isCollapsed ? 80 : 256 }}
        className="flex-1 flex flex-col min-h-screen transition-all duration-200"
      >
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input
                type="text"
                placeholder="Pesquisar operações, lojistas ou SKUs..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Sun className="hidden dark:block" size={22} />
              <Moon className="block dark:hidden" size={22} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 relative hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Bell size={22} />
                <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#101622]"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <h4 className="font-bold text-slate-900 dark:text-white">Notificações Admin</h4>
                        <span className="text-[10px] font-black uppercase text-primary bg-accent px-2 py-0.5 rounded-full">3 Novas</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <div className="flex gap-3">
                              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                                n.type === 'alert' ? 'bg-red-100 text-red-600' : 
                                n.type === 'success' ? 'bg-green-100 text-green-600' : 
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {n.type === 'alert' ? <AlertCircle size={16} /> : 
                                 n.type === 'success' ? <CheckCircle2 size={16} /> : 
                                 <Info size={16} />}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{n.title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                                <p className="text-[9px] text-slate-400 mt-2 font-medium uppercase tracking-wider">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-slate-50/50 dark:bg-slate-800/50">
                        Ver todas as notificações
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/admin/profile")}
                className="size-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-primary font-bold overflow-hidden hover:border-accent transition-colors"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Settings size={22} className="text-slate-500" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
