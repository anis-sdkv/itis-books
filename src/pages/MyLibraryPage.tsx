import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Heart, Star, Quote, Trash2, Edit3 } from "lucide-react";
import { userContentService } from "@/data/services/UserContentService";
import { bookService } from "@/data/services/BookService";
import { LikedBookModel, ReviewModel, QuoteModel, ShelfModel } from '@/data/models/UserContent';
import { BookModel } from '@/data/models/BookModel';

type FilterType = 'all' | 'liked' | 'reviewed' | 'quoted';

export default function MyLibraryPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // Данные пользователя
    const [likedBooks, setLikedBooks] = useState<(LikedBookModel & { book?: BookModel })[]>([]);
    const [userReviews, setUserReviews] = useState<(ReviewModel & { book?: BookModel })[]>([]);
    const [userQuotes, setUserQuotes] = useState<(QuoteModel & { book?: BookModel })[]>([]);
    const [userShelves, setUserShelves] = useState<ShelfModel[]>([]);

    // Состояния для диалогов
    const [isCreateShelfOpen, setIsCreateShelfOpen] = useState(false);
    const [isEditShelfOpen, setIsEditShelfOpen] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState<ShelfModel | null>(null);
    const [shelfName, setShelfName] = useState('');

    // Статистика
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalReviews: 0,
        totalQuotes: 0,
        totalShelves: 0
    });
    const [booksMap, setBooksMap] = useState<Map<number, BookModel>>(new Map());

    useEffect(() => {
        checkAuthAndLoadData();
    }, []);

    const checkAuthAndLoadData = async () => {
        const isAuth = !!localStorage.getItem('access_token');
        setIsAuthenticated(isAuth);

        if (isAuth) {
            await loadData();
        }
        setLoading(false);
    };

    const loadData = async () => {
        try {
            setLoading(true);

            // Загружаем все данные пользователя параллельно
            const [likedBooksData, reviewsData, quotesData, shelvesData] = await Promise.all([
                userContentService.getLikedBooks(),
                userContentService.getMyReviews(),
                userContentService.getMyQuotes(),
                userContentService.getShelves()
            ]);

            // Получаем уникальные gutenberg_id для загрузки информации о книгах
            const uniqueBookIds = new Set<number>();

            likedBooksData.results.forEach(book => uniqueBookIds.add(book.gutenberg_id));
            reviewsData.results.forEach(review => uniqueBookIds.add(review.gutenberg_id));
            quotesData.results.forEach(quote => uniqueBookIds.add(quote.gutenberg_id));
            shelvesData.results.forEach(shelf => {
                (shelf.books || []).forEach(gutenbergId => uniqueBookIds.add(gutenbergId));
            });

            // Загружаем информацию о книгах
            const tempBooksMap = new Map<number, BookModel>();
            await Promise.all(
                Array.from(uniqueBookIds).map(async (gutenbergId) => {
                    try {
                        const book = await bookService.getBookById(gutenbergId);
                        tempBooksMap.set(gutenbergId, book);
                    } catch (error) {
                        console.error(`Error loading book ${gutenbergId}:`, error);
                    }
                })
            );
            setBooksMap(tempBooksMap);

            // Объединяем данные с информацией о книгах
            const likedBooksWithInfo = likedBooksData.results.map(likedBook => ({
                ...likedBook,
                book: tempBooksMap.get(likedBook.gutenberg_id)
            }));

            const reviewsWithInfo = reviewsData.results.map(review => ({
                ...review,
                book: tempBooksMap.get(review.gutenberg_id)
            }));

            const quotesWithInfo = quotesData.results.map(quote => ({
                ...quote,
                book: tempBooksMap.get(quote.gutenberg_id)
            }));

            console.log("likedBooksData", likedBooksWithInfo);
            console.log("tempBooksMap", Array.from(tempBooksMap.entries()));
            setLikedBooks(likedBooksWithInfo);
            setUserReviews(reviewsWithInfo);
            setUserQuotes(quotesWithInfo);
            setUserShelves(shelvesData.results);

            // Обновляем статистику
            setStats({
                totalBooks: uniqueBookIds.size,
                totalReviews: reviewsData.results.length,
                totalQuotes: quotesData.results.length,
                totalShelves: shelvesData.results.length
            });

        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShelf = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shelfName.trim()) return;

        try {
            await userContentService.createShelf({ name: shelfName });
            setShelfName('');
            setIsCreateShelfOpen(false);
            loadData(); // Перезагружаем данные
        } catch (error) {
            console.error('Error creating shelf:', error);
        }
    };

    const handleEditShelf = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedShelf || !shelfName.trim()) return;

        try {
            await userContentService.updateShelf(selectedShelf.id, { name: shelfName });
            setShelfName('');
            setSelectedShelf(null);
            setIsEditShelfOpen(false);
            loadData();
        } catch (error) {
            console.error('Error updating shelf:', error);
        }
    };

    const handleDeleteShelf = async (shelfId: number) => {
        if (!confirm('Вы уверены, что хотите удалить эту полку?')) return;

        try {
            await userContentService.deleteShelf(shelfId);
            loadData();
        } catch (error) {
            console.error('Error deleting shelf:', error);
        }
    };

    const openEditShelfDialog = (shelf: ShelfModel) => {
        setSelectedShelf(shelf);
        setShelfName(shelf.name);
        setIsEditShelfOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const getFilteredContent = () => {
        switch (activeFilter) {
            case 'liked':
                return likedBooks.map(item => ({
                    type: 'liked' as const,
                    id: item.id,
                    book: item.book,
                    date: item.added_at,
                    data: item
                }));
            case 'reviewed':
                return userReviews.map(item => ({
                    type: 'review' as const,
                    id: item.id,
                    book: item.book,
                    date: item.created_at,
                    data: item
                }));
            case 'quoted':
                return userQuotes.map(item => ({
                    type: 'quote' as const,
                    id: item.id,
                    book: item.book,
                    date: item.created_at,
                    data: item
                }));
            default: // 'all'
                const allItems = [
                    ...likedBooks.map(item => ({
                        type: 'liked' as const,
                        id: item.id,
                        book: item.book,
                        date: item.added_at,
                        data: item
                    })),
                    ...userReviews.map(item => ({
                        type: 'review' as const,
                        id: item.id,
                        book: item.book,
                        date: item.created_at,
                        data: item
                    })),
                    ...userQuotes.map(item => ({
                        type: 'quote' as const,
                        id: item.id,
                        book: item.book,
                        date: item.created_at,
                        data: item
                    }))
                ];
                return allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Загрузка...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Войдите в аккаунт</h2>
                    <p className="text-gray-600 mb-6">
                        Чтобы видеть свои книги, отзывы и цитаты, необходимо авторизоваться
                    </p>
                    <Button>Войти</Button>
                </div>
            </div>
        );
    }

    const filteredContent = getFilteredContent();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Заголовок и статистика */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Моя библиотека</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Книг: {stats.totalBooks}</span>
                        <span>Отзывов: {stats.totalReviews}</span>
                        <span>Цитат: {stats.totalQuotes}</span>
                        <span>Полок: {stats.totalShelves}</span>
                    </div>
                </div>

                <Dialog open={isCreateShelfOpen} onOpenChange={setIsCreateShelfOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Создать полку
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Создать новую полку</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateShelf} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Название полки</label>
                                <Input
                                    value={shelfName}
                                    onChange={(e) => setShelfName(e.target.value)}
                                    placeholder="Введите название полки"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Создать полку</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Быстрые действия */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Button variant="outline" className="h-12" asChild>
                    <Link to="/books">Найти что почитать</Link>
                </Button>
                <Button variant="outline" className="h-12">
                    Загрузить книгу
                </Button>
                <Button variant="outline" className="h-12">
                    Мои достижения
                </Button>
                <Button variant="outline" className="h-12">
                    Авторы
                </Button>
            </div>

            {/* Мои полки */}
            {userShelves.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Мои полки</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userShelves.map((shelf) => {
                            // Для каждой полки получаем книги
                            const shelfBooks = (shelf.books || [])
                                .map(gutenbergId => booksMap.get(gutenbergId))
                                .filter(Boolean) as BookModel[];
                            return (
                                <Card key={shelf.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{shelf.name}</CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditShelfDialog(shelf)}
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteShelf(shelf.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Книг: {shelfBooks.length}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {shelfBooks.length === 0 && (
                                                <div className="text-gray-400 text-sm">Нет книг на этой полке</div>
                                            )}
                                            {shelfBooks.map(book => (
                                                <Link
                                                    key={book.gutenberg_id}
                                                    to={`/books/${book.gutenberg_id}`}
                                                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 transition"
                                                >
                                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium text-blue-700">{book.title}</span>
                                                    <span className="text-gray-500 text-xs">
                                    {book.authors.map(a => a.name).join(', ')}
                                </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                </div>
            )}

            {/* Фильтры */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Активность</h2>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={activeFilter === 'all' ? 'default' : 'ghost'}
                        onClick={() => setActiveFilter('all')}
                    >
                        Все ({likedBooks.length + userReviews.length + userQuotes.length})
                    </Button>
                    <Button
                        variant={activeFilter === 'liked' ? 'default' : 'ghost'}
                        onClick={() => setActiveFilter('liked')}
                        className="flex items-center gap-2"
                    >
                        <Heart className="h-4 w-4" />
                        Избранное ({likedBooks.length})
                    </Button>
                    <Button
                        variant={activeFilter === 'reviewed' ? 'default' : 'ghost'}
                        onClick={() => setActiveFilter('reviewed')}
                        className="flex items-center gap-2"
                    >
                        <Star className="h-4 w-4" />
                        Отзывы ({userReviews.length})
                    </Button>
                    <Button
                        variant={activeFilter === 'quoted' ? 'default' : 'ghost'}
                        onClick={() => setActiveFilter('quoted')}
                        className="flex items-center gap-2"
                    >
                        <Quote className="h-4 w-4" />
                        Цитаты ({userQuotes.length})
                    </Button>
                </div>
            </div>

            {/* Контент */}
            <div className="space-y-6">
                {filteredContent.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Пока пусто</h3>
                        <p className="text-gray-600 mb-6">
                            {activeFilter === 'all' && "Начните читать книги и добавляйте их в избранное"}
                            {activeFilter === 'liked' && "Добавьте книги в избранное"}
                            {activeFilter === 'reviewed' && "Напишите первый отзыв о книге"}
                            {activeFilter === 'quoted' && "Добавьте первую цитату из книги"}
                        </p>
                        <Button asChild>
                            <Link to="/books">Найти книги</Link>
                        </Button>
                    </div>
                ) : (
                    filteredContent.map((item) => (
                        <Card key={`${item.type}-${item.id}`}>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    {/* Иконка типа активности */}
                                    <div className="flex-shrink-0">
                                        {item.type === 'liked' && (
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <Heart className="h-5 w-5 text-red-600" />
                                            </div>
                                        )}
                                        {item.type === 'review' && (
                                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <Star className="h-5 w-5 text-yellow-600" />
                                            </div>
                                        )}
                                        {item.type === 'quote' && (
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Quote className="h-5 w-5 text-blue-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Контент */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold">
                                                {item.book ? (
                                                    <Link
                                                        to={`/books/${item.book.gutenberg_id}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {item.book.title}
                                                    </Link>
                                                ) : (
                                                    'Книга не найдена'
                                                )}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(item.date)}
                                            </span>
                                        </div>

                                        {item.book && (
                                            <p className="text-sm text-gray-600 mb-3">
                                                {item.book.authors.map(author => author.name).join(', ')}
                                            </p>
                                        )}

                                        {/* Специфичный контент для каждого типа */}
                                        {item.type === 'liked' && (
                                            <p className="text-sm text-gray-700">
                                                Добавлено в избранное
                                            </p>
                                        )}

                                        {item.type === 'review' && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {renderStars((item.data as ReviewModel).rating)}
                                                </div>
                                                <p className="text-gray-700 line-clamp-3">
                                                    {(item.data as ReviewModel).text}
                                                </p>
                                            </div>
                                        )}

                                        {item.type === 'quote' && (
                                            <div>
                                                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-2">
                                                    "{(item.data as QuoteModel).text}"
                                                </blockquote>
                                                {(item.data as QuoteModel).page_reference && (
                                                    <p className="text-sm text-gray-500">
                                                        Стр. {(item.data as QuoteModel).page_reference}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Диалог редактирования полки */}
            <Dialog open={isEditShelfOpen} onOpenChange={setIsEditShelfOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактировать полку</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditShelf} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Название полки</label>
                            <Input
                                value={shelfName}
                                onChange={(e) => setShelfName(e.target.value)}
                                placeholder="Введите название полки"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Сохранить изменения</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}