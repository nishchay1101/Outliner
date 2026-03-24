import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import View from './pages/View';
import { Toast } from './components/UI/Toast';
import { ThemeToggle } from './components/UI/ThemeToggle';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:pageId" element={<Editor />} />
        <Route path="/view/:pageId" element={<View />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
