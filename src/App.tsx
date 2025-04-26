import './App.css'

import LayoutHeader from "@/shared/LayoutHeader";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from '@/pages/HomePage';
import MyBooksPage from "@/pages/MyBooksPage";
import ProfilePage from "@/pages/ProfilePage";
import BookPage from "@/pages/BookPage";
import ErrorPage from '@/pages/ErrorPage';
import AuthPage from "@/pages/Auth/AuthPage";


export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <LayoutHeader/>
                <main className="flex-1 container mx-auto py-6">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/my-books" element={<MyBooksPage/>}/>
                        <Route path="/profile" element={<ProfilePage/>}/>
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
