import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, MapPin, FileText, User, LogOut, Leaf, ClipboardList, BarChart3, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const farmerLinks = [
    { to:'/farmer', icon:LayoutDashboard, labelKey:'dashboard', end:true, emoji:'🏠' },
    { to:'/farmer/map', icon:MapPin, labelKey:'landMap', emoji:'🗺️' },
    { to:'/farmer/reports', icon:FileText, labelKey:'reports', emoji:'📄' },
    { to:'/farmer/profile', icon:User, labelKey:'profile', emoji:'👤' },
  ];
  const adminLinks = [
    { to:'/admin', icon:LayoutDashboard, labelKey:'dashboard', end:true, emoji:'🏠' },
    { to:'/admin/requests', icon:ClipboardList, labelKey:'requests', emoji:'📋' },
    { to:'/admin/analytics', icon:BarChart3, labelKey:'analytics', emoji:'📊' },
    { to:'/admin/reports', icon:FileText, labelKey:'reports', emoji:'📄' },
    { to:'/admin/profile', icon:User, labelKey:'profile', emoji:'👤' },
  ];
  const links = user?.role==='admin' ? adminLinks : farmerLinks;
  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-700/50">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
          <Leaf size={18} className="text-white"/>
        </div>
        <div>
          <p className="font-display font-bold text-slate-800 dark:text-white text-sm leading-tight">AgriComp</p>
          <p className="text-xs text-slate-400">{t('tagline')}</p>
        </div>
        <button onClick={onClose} className="ml-auto lg:hidden btn-ghost p-1"><X size={16}/></button>
      </div>

      <div className="px-4 py-3">
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${user?.role==='admin'?'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400':'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"/>
          {user?.role==='admin'?t('adminPortal'):t('farmerPortal')}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-2 mt-1">
          {t('dashboard')}
        </p>
        {links.map(({to,icon:Icon,labelKey,end,emoji})=>(
          <NavLink key={to} to={to} end={end} onClick={()=>window.innerWidth<1024&&onClose()}
            className={({isActive})=>`sidebar-link group ${isActive?'active':''}`}>
            {({isActive})=>(
              <>
                <span className="text-lg leading-none">{emoji}</span>
                <span className="flex-1">{t(labelKey)}</span>
                {isActive&&<ChevronRight size={14} className="text-primary-500 opacity-60"/>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full sidebar-link text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
          <LogOut size={17}/> <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-700/40">
        <SidebarContent/>
      </aside>
      <AnimatePresence>
        {open&&(
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"/>
            <motion.aside initial={{x:-280}} animate={{x:0}} exit={{x:-280}} transition={{type:'spring',damping:28,stiffness:300}}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 lg:hidden flex flex-col">
              <SidebarContent/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
