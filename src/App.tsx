import './App.css'

import LayoutHeader from "@/shared/LayoutHeader";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import MyBooksPage from "@/pages/MyBooksPage";
import ProfilePage from "@/pages/ProfilePage";
import SearchPage from './pages/SearchPage';
import BookPage from "@/pages/BookPage";
import ErrorPage from '@/pages/ErrorPage';
import AuthPage from "@/pages/Auth/AuthPage";
import MainPage from "@/pages/MainPage";


export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <LayoutHeader/>
                <main className="flex-1 container mx-auto py-6">
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/my-books" element={<MyBooksPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/book" element={<BookPage/>}/>
                        <Route path="/auth/*" element={<AuthPage/>}/>
                        <Route path="/book" element={<BookPage/>}/>
                        <Route path="*" element={<ErrorPage/>}/>
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
