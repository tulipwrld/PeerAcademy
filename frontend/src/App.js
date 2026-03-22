import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Register from './pages/Register';
import AuthPage from './pages/Auth';
import Login from './pages/Login';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Post from './pages/CreatePost';
import Feed from './pages/Feed';
import PostDetails from './pages/PostDetails';
// import 
import './index.css';

export default function App() {
  const [user, setUser] = useState(null); // null = not logged in
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Алина Смирнова приняла запрос на занятие', time: '5 мин назад', read: false },
    { id: 2, text: 'Максим Козлов написал вам сообщение', time: '1 час назад', read: false },
    { id: 3, text: 'Новый отзыв на ваш профиль ⭐⭐⭐⭐⭐', time: '3 часа назад', read: true },
    { id: 4, text: 'Даша Воронова хочет провести занятие', time: 'вчера', read: true },
  ]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const markAllRead = () =>
    setNotifications(n => n.map(x => ({ ...x, read: true })));

  return (
    <BrowserRouter>
      <Navbar
        user={user}
        onLogout={logout}
        notifications={notifications}
        onMarkAllRead={markAllRead}
      />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/auth/google" element={<AuthPage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={login} />} />
        <Route path="/search" element={<Search />} />
        {/* <Route path="/profile/:id" element={<Profile user={user} />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages user={user} />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:postId" element={<PostDetails />} />
        <Route path="/feed" element={<Feed user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
