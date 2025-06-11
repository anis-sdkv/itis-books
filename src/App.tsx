import './App.css'

import LayoutHeader from "@/shared/LayoutHeader";
import {Routes, Route, BrowserRouter, useLocation} from "react-router-dom";
import HomePage from '@/pages/HomePage';
import MyLibraryPage from "@/pages/MyLibraryPage";
import ProfilePage from "@/pages/ProfilePage";
import BookPage from "@/pages/BookPage";
import ErrorPage from '@/pages/ErrorPage';
import AuthPage from "@/pages/Auth/AuthPage";
import ReaderPage from "@/pages/ReaderPage";

function AppLayout() {
    const location = useLocation();
    const hideHeader = /^\/reader\/\d+/.test(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeader && <LayoutHeader/>}
            <main className="flex-1 container mx-auto py-6">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/my-library" element={<MyLibraryPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/books/:id" element={<BookPage/>}/>
                    <Route path="/reader/:id" element={<ReaderPage/>}/>
                    <Route path="/auth/*" element={<AuthPage/>}/>
                    <Route path="*" element={<ErrorPage/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppLayout/>
        </BrowserRouter>
    );
}
