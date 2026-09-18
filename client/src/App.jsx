import React from 'react';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return <><Dashboard /><Toaster richColors position="bottom-right" theme="dark" /></>;
}
