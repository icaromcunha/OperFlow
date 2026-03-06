import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  BarChart3, 
  LifeBuoy, 
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
  FileText,
  Plus,
  AlertCircle,
  CheckCircle2,
  Info,
  User
} from "lucide-react";
import { useTheme } from "../ThemeProvider";

export default function ClientLayout({ user, onLogout }: { user: any; onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { config, toggleDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Relatórios", path: "/reports" },
    { icon: LifeBuoy, label: "Suporte", path: "/support" },
  ];

  const notifications = [
    { id: 1, title: "Estoque Crítico", message: "SKU ECOM-PRO-X2 está com estoque baixo na Amazon.", type: "alert", time: "5 min atrás" },
    { id: 2, title: "Protocolo Aprovado", message: "Sua solicitação #PRT-124 foi aprovada pelo consultor.", type: "success", time: "1 hora atrás" },
    { id: 3, title: "Nova Integração", message: "O canal Shopee foi sincronizado com sucesso.", type: "info", time: "3 horas atrás" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#101622] flex font-sans transition-colors duration-200">
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

        <nav className="flex-1 px-4 space-y-2 mt-4">
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
                      className="whitespace-nowrap"
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

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t border-white/5">
          <div className={`bg-white/5 rounded-2xl p-3 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <Link 
              to="/profile"
              className="size-10 rounded-full bg-slate-500 overflow-hidden border-2 border-white/10 shrink-0 hover:border-accent transition-colors flex items-center justify-center"
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-white" />
              )}
            </Link>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.nome}</p>
                <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider">ID: {user.id || '8902134'}</p>
              </div>
            )}
            {!isCollapsed && (
              <button onClick={onLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button onClick={onLogout} className="w-full mt-2 p-2 text-slate-400 hover:text-red-400 flex justify-center">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div 
        initial={false}
        animate={{ marginLeft: isCollapsed ? 80 : 256 }}
        className="flex-1 flex flex-col min-h-screen transition-all duration-200"
      >
        {/* Header */}
        <header className="h-20 bg-white dark:bg-[#101622] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40 transition-colors duration-200">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">OperFlow</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative w-64 lg:w-96 hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input 
                type="text" 
                placeholder="Buscar SKUs ou protocolos..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent transition-all text-slate-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Sun className="hidden dark:block" size={22} />
                <Moon className="block dark:hidden" size={22} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-colors"
                >
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 size-2.5 bg-red-500 border-2 border-white dark:border-[#101622] rounded-full"></span>
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
                          <h4 className="font-bold text-slate-900 dark:text-white">Notificações</h4>
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

              <button 
                onClick={() => navigate("/profile")}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center"
              >
                {user.avatar ? (
                  <div className="size-6 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <Settings size={22} />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
