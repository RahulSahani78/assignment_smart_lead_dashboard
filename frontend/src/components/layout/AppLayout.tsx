import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AppLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
    <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
      © {new Date().getFullYear()} Smart Leads — Built with React + Node + MongoDB.
    </footer>
  </div>
);

export default AppLayout;
