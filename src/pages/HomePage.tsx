import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Input} from "@/components/ui/input";
import {AuthorModel, BookModel} from '@/data/models/BookModel';
import {GetBooksRequest} from '@/data/requests/FetchBookRequest';
import {bookService} from "@/data/services/BookService";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useNavigate} from 'react-router-dom';
import {Recommendation} from '@/data/models/Recommedation';
import {userContentService} from "@/data/services/UserContentService";
import {useAuth} from "@/context/useAuth";
import {RecommendService} from "@/data/services/RecomendationService";

// Доступные языки для фильтрации
const languages = [
    {code: 'en', name: 'English'},
    {code: 'ru', name: 'Русский'},
    {code: 'fr', name: 'Français'},
    {code: 'de', name: 'Deutsch'},
    {code: 'es', name: 'Español'},
    {code: 'it', name: 'Italiano'},
];

// Варианты сортировки
const sortingOptions = [
    {value: 'title', label: 'По названию'},
    {value: '-download_count', label: 'По популярности'},
    {value: 'download_count', label: 'Менее популярные'},
];

export default function HomePage() {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [recommendedBooks, setRecommendedBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [selectedSort, setSelectedSort] = useState<string>('-download_count');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const navigate = useNavigate();

    const [userRecs, setUserRecs] = useState<Recommendation[]>([]);
    const [userRecsLoading, setUserRecsLoading] = useState(false);

    const {user} = useAuth(); // если у тебя есть такой контекст

    const loadUserRecommendations = async () => {
        if (!user) return;
        try {
            setUserRecsLoading(true);
            const likedBooks = await userContentService.getLikedBooks();
            const likedBookIds = likedBooks.results.map(b => b.gutenberg_id);
            console.log(likedBookIds);
            if (likedBookIds.length === 0) {
                setUserRecs([]);
                return;
            }
            const recs = await RecommendService.getRecommendationsByBooks(likedBookIds, 10);
            console.log(recs)
            setUserRecs(recs);
        } catch (e) {
            setUserRecs([]);
            console.error(e);
        } finally {
            setUserRecsLoading(false);
        }
    };

    useEffect(() => {
        loadUserRecommendations();
    }, [user]);

    // Загрузка книг
    const loadBooks = async () => {
        try {
            setLoading(true);
            const params: GetBooksRequest = {
                page: currentPage,
                ordering: selectedSort,
                page_size: 10
            };

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            // --- Исправлено:
            if (selectedLanguage !== 'all') {
                params.language = selectedLanguage;
            }

            const response = await bookService.getBooks(params);
            setBooks(response.results);
            setTotalCount(response.count);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка рекомендуемых книг
    const loadRecommendedBooks = async () => {
        try {
            const response = await bookService.getPopularBooks(1);
            setRecommendedBooks(response.results.slice(0, 7));
        } catch (error) {
            console.error('Ошибка загрузки рекомендаций:', error);
        }
    };

    useEffect(() => {
        loadBooks();
    }, [currentPage, selectedSort, selectedLanguage]);

    useEffect(() => {
        loadRecommendedBooks();
    }, []);

    // Обработка поиска
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadBooks();
    };

    // Сброс фильтров
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedLanguage('all'); // теперь "all" по умолчанию
        setSelectedSort('-download_count');
        setCurrentPage(1);
    };

    // Форматирование авторов
    const formatAuthors = (authors: AuthorModel[]) => {
        return authors.map(author => author.name).join(', ');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Все книги</h1>

            {/* Поиск и фильтры */}
            <div className="mb-8 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Поиск по названию или автору..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit">Поиск</Button>
                </form>

                <div className="flex flex-wrap gap-4">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Выберите язык"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все языки</SelectItem>
                            {languages.map(lang => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Сортировка"/>
                        </SelectTrigger>
                        <SelectContent>
                            {sortingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                </div>
            </div>

            {user && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Рекомендовано вам</h2>
                    {userRecsLoading ? (
                        <div className="text-muted-foreground">Загрузка...</div>
                    ) : userRecs.length === 0 ? (
                        <div className="text-muted-foreground text-sm">Нет персональных рекомендаций</div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {userRecs.map((book) => (
                                <Card
                                    key={book.book_id}
                                    className="min-w-[220px] max-w-xs flex-shrink-0 hover:bg-muted/50 cursor-pointer transition"
                                    onClick={() => navigate(`/books/${book.book_id}`)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-xs text-muted-foreground">
                                        {book.similarity && (
                                            <div>Похожесть: {(book.similarity * 100).toFixed(0)}%</div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Основной контент с книгами */}
                <div className="md:col-span-2 space-y-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <p>Загрузка книг...</p>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-8">
                            <p>Книги не найдены</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    Найдено книг: {totalCount}
                                </p>
                            </div>

                            {books.map((book) => (
                                <Card
                                    key={book.gutenberg_id}
                                    className="cursor-pointer hover:bg-muted/50 transition"
                                    onClick={() => navigate(`/books/${book.gutenberg_id}`)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">{book.title}</CardTitle>
                                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            {book.authors.length > 0 && (
                                                <span>Автор: {formatAuthors(book.authors)}</span>
                                            )}
                                            {book.languages.length > 0 && (
                                                <span>• Язык: {book.languages[0].code.toUpperCase()}</span>
                                            )}
                                            <span>• Скачиваний: {book.download_count.toLocaleString()}</span>
                                        </div>
                                    </CardHeader>
                                    {/* <CardContent> ...</CardContent>  убрано */}
                                </Card>
                            ))}

                            {/* Пагинация */}
                            <div className="flex justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    disabled={!hasPrevious}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Предыдущая
                                </Button>
                                <span className="flex items-center px-4">
                                    Страница {currentPage}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={!hasNext}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Следующая
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {/* Боковая панель */}
                <div className="space-y-8">
                    {/* Прогресс чтения */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ваш прогресс чтения</CardTitle>
                            <CardDescription>1 дней чтения в апреле</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={33} className="h-2"/>
                            <p className="text-sm text-muted-foreground mt-2">
                                Прогресс обновляется раз в сутки
                            </p>
                        </CardContent>
                    </Card>

                    {/* Рекомендуемые книги */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Популярные книги</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recommendedBooks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Загрузка рекомендаций...</p>
                            ) : (
                                recommendedBooks.map((book) => (
                                    <div key={book.gutenberg_id}
                                         className="border-b pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 p-2 rounded">
                                        <h4 className="font-medium text-sm line-clamp-2">{book.title}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {formatAuthors(book.authors)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {book.download_count.toLocaleString()} скачиваний
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}