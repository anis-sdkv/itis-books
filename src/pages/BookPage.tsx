import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Bookmark, Star, Quote, MessageCircle, Heart} from "lucide-react";
import {AuthorModel, BookModel} from '@/data/models/BookModel';
import {BookUserContentModel, LikedBookModel, ReviewModel, ShelfModel} from '@/data/models/UserContent';
import {userContentService} from "@/data/services/UserContentService";
import {bookService} from "@/data/services/BookService";
import {RecommendService} from "@/data/services/RecomendationService";
import {Recommendation} from "@/data/models/Recommedation";

export default function BookPage() {
    const {id} = useParams<{ id: string }>();
    const bookId = parseInt(id || '0');
    const navigate = useNavigate();

    const [book, setBook] = useState<BookModel | null>(null);
    const [userContent, setUserContent] = useState<BookUserContentModel | null>(null);
    const [userLikedBook, setUserLikedBook] = useState<LikedBookModel | null>(null);
    const [userReview, setUserReview] = useState<ReviewModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Состояния для форм
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [quoteText, setQuoteText] = useState('');
    const [quotePageRef, setQuotePageRef] = useState('');
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

    // shelf
    const [isAddToShelfOpen, setIsAddToShelfOpen] = useState(false);
    const [userShelves, setUserShelves] = useState<ShelfModel[]>([]);
    const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);
    const [addingToShelf, setAddingToShelf] = useState(false);
    const [addShelfMessage, setAddShelfMessage] = useState<string | null>(null);

    const [similarBooks, setSimilarBooks] = useState<Recommendation[]>([]);
    const [similarBooksLoading, setSimilarBooksLoading] = useState(false);

    useEffect(() => {
        const isAuth = !!localStorage.getItem('access_token');
        setIsAuthenticated(isAuth);
        loadBookData(isAuth);
    }, [bookId]);

    const loadSimilarBooks = async (book_id: number) => {
        try {
            setSimilarBooksLoading(true);
            console.log(book_id)
            const recs = await RecommendService.getRecommendationsByBooks([book_id], 10);
            setSimilarBooks(recs);
        } catch (e) {
            setSimilarBooks([]);
            console.error(e);
        } finally {
            setSimilarBooksLoading(false);
        }
    };

    const loadBookData = async (isAuth: boolean | null = null) => {
        try {
            if (isAuth == null) isAuth = isAuthenticated

            setLoading(true);

            // Загружаем информацию о книге
            const bookData = await bookService.getBookById(bookId);
            setBook(bookData);
            await loadSimilarBooks(bookData.gutenberg_id);

            // Загружаем пользовательский контент
            const contentData = await bookService.getBookUserContent(bookData.gutenberg_id);
            console.log(contentData)
            setUserContent(contentData);

            // Если пользователь авторизован, загружаем его данные
            if (isAuth) {
                const likedBook = await userContentService.checkIfBookLiked(bookData.gutenberg_id);
                setUserLikedBook(likedBook);

                const review = await userContentService.getMyReviewForBook(bookData.gutenberg_id);
                setUserReview(review);
                if (review) {
                    setReviewText(review.text);
                    setReviewRating(review.rating);
                }
            }
        } catch (error) {
            console.error('Error loading book data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLike = async () => {
        if (!isAuthenticated || !book) return;

        try {
            if (userLikedBook) {
                await userContentService.removeFromLikedBooks(userLikedBook.id);
                setUserLikedBook(null);
            } else {
                const newLike = await userContentService.addToLikedBooks({
                    gutenberg_id: book.gutenberg_id
                });
                setUserLikedBook(newLike);
            }
            // Обновляем счетчик лайков
            loadBookData();
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !book) return;

        try {
            if (userReview) {
                // Обновляем существующий отзыв
                const updatedReview = await userContentService.updateReview(userReview.id, {
                    text: reviewText,
                    rating: reviewRating
                });
                setUserReview(updatedReview);
            } else {
                // Создаем новый отзыв
                const newReview = await userContentService.createReview({
                    gutenberg_id: book.gutenberg_id,
                    text: reviewText,
                    rating: reviewRating
                });
                setUserReview(newReview);
            }
            setIsReviewDialogOpen(false);
            loadBookData(); // Обновляем данные
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleSubmitQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !book) return;

        try {
            await userContentService.createQuote({
                gutenberg_id: book.gutenberg_id,
                text: quoteText,
                page_reference: quotePageRef
            });
            setQuoteText('');
            setQuotePageRef('');
            setIsQuoteDialogOpen(false);
            loadBookData(); // Обновляем данные
        } catch (error) {
            console.error('Error submitting quote:', error);
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview) return;

        try {
            await userContentService.deleteReview(userReview.id);
            setUserReview(null);
            setReviewText('');
            setReviewRating(5);
            loadBookData();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const formatAuthors = (authors: AuthorModel[]) => {
        return authors.map(author => author.name).join(', ');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const loadUserShelves = async () => {
        try {
            const shelvesData = await userContentService.getShelves();

            setUserShelves(shelvesData.results);
        } catch (e) {
            setUserShelves([]);
            console.error('Error deleting review:', e);
        }
    };
    const handleOpenAddToShelf = () => {
        setIsAddToShelfOpen(true);
        loadUserShelves();
        setAddShelfMessage(null);
    };

    const handleAddBookToShelf = async () => {
        if (!book || selectedShelfId == null) return;
        setAddingToShelf(true);
        setAddShelfMessage(null);

        try {
            // Находим нужную полку
            const shelf = userShelves.find(s => s.id === selectedShelfId);
            if (!shelf) throw new Error('Полка не найдена');
            // Не добавлять книгу второй раз
            if (shelf.books.includes(book.gutenberg_id)) {
                setAddShelfMessage("Эта книга уже есть на выбранной полке");
                return;
            }
            const newBookIds = [...shelf.books, book.gutenberg_id];
            await userContentService.updateShelf(shelf.id, {book_ids: newBookIds});
            setAddShelfMessage("Книга добавлена в полку!");
            // Можно закрывать диалог через секунду или оставлять открытым
            setTimeout(() => setIsAddToShelfOpen(false), 1000);
        } catch (e) {
            setAddShelfMessage("Ошибка при добавлении книги");
            console.error('Error deleting review:', e);
        } finally {
            setAddingToShelf(false);
        }
    };


    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="text-center">Загрузка...</div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="text-center">Книга не найдена</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* Заголовок и кнопки */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Обложка книги */}
                <div className="w-full md:w-1/3">
                    <div className="bg-gray-200 rounded-lg shadow-md w-full h-80 flex items-center justify-center">
                        <span className="text-gray-500">Обложка книги</span>
                    </div>
                </div>

                {/* Информация о книге */}
                <div className="w-full md:w-2/3 space-y-4">
                    <h1 className="text-3xl font-bold">{book.title}</h1>
                    {book.authors.length > 0 && (
                        <p className="text-gray-600">Авторы: {formatAuthors(book.authors)}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Скачиваний: {book.download_count.toLocaleString()}</span>
                        {userContent && (
                            <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4"/>
                                {userContent.likes_count}
                            </span>
                        )}
                        {book.languages.length > 0 && (
                            <span>Язык: {book.languages[0].code.toUpperCase()}</span>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate(`/reader/${bookId}`)}
                        >
                            <Bookmark className="h-4 w-4"/>
                            Читать
                        </Button>

                        {isAuthenticated && (
                            <Button
                                variant={userLikedBook ? "default" : "outline"}
                                className="flex items-center gap-2"
                                onClick={handleToggleLike}
                            >
                                <Heart className={`h-4 w-4 ${userLikedBook ? 'fill-current' : ''}`}/>
                                {userLikedBook ? 'В избранном' : 'В избранное'}
                            </Button>
                        )}
                        {isAuthenticated && (
                            <>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={handleOpenAddToShelf}
                                >
                                    <Bookmark className="h-4 w-4"/>
                                    Добавить в полку
                                </Button>
                                <Dialog open={isAddToShelfOpen} onOpenChange={setIsAddToShelfOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Добавить в полку</DialogTitle>
                                        </DialogHeader>
                                        {userShelves.length === 0 ? (
                                            <div className="py-4 text-gray-500">У вас пока нет ни одной полки.<br/>Создайте
                                                полку на странице "Моя библиотека".</div>
                                        ) : (
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    handleAddBookToShelf();
                                                }}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Выберите
                                                        полку</label>
                                                    <select
                                                        className="w-full border p-2 rounded"
                                                        value={selectedShelfId ?? ''}
                                                        onChange={e => setSelectedShelfId(Number(e.target.value))}
                                                        required
                                                    >
                                                        <option value="" disabled>Выберите полку</option>
                                                        {userShelves.map(shelf => (
                                                            <option key={shelf.id} value={shelf.id}>
                                                                {shelf.name} ({shelf.books.length} книг)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {addShelfMessage && (
                                                    <div
                                                        className="text-center text-sm text-green-700">{addShelfMessage}</div>
                                                )}
                                                <Button type="submit" className="w-full"
                                                        disabled={addingToShelf || !selectedShelfId}>
                                                    {addingToShelf ? "Добавление..." : "Добавить"}
                                                </Button>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </div>

                    {/* Кнопки для авторизованных пользователей */}
                    {isAuthenticated && (
                        <div className="flex gap-2 pt-4">
                            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4"/>
                                        {userReview ? 'Изменить отзыв' : 'Написать отзыв'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {userReview ? 'Изменить отзыв' : 'Написать отзыв'}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Оценка</label>
                                            {renderStars(reviewRating, true, setReviewRating)}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Отзыв</label>
                                            <Textarea
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                placeholder="Поделитесь своими впечатлениями о книге..."
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit">
                                                {userReview ? 'Обновить' : 'Опубликовать'}
                                            </Button>
                                            {userReview && (
                                                <Button type="button" variant="destructive"
                                                        onClick={handleDeleteReview}>
                                                    Удалить
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Quote className="h-4 w-4"/>
                                        Добавить цитату
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Добавить цитату</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitQuote} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Цитата</label>
                                            <Textarea
                                                value={quoteText}
                                                onChange={(e) => setQuoteText(e.target.value)}
                                                placeholder="Введите цитату из книги..."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Страница
                                                (необязательно)</label>
                                            <Input
                                                value={quotePageRef}
                                                onChange={(e) => setQuotePageRef(e.target.value)}
                                                placeholder="Номер страницы или глава"
                                            />
                                        </div>
                                        <Button type="submit">Добавить цитату</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    {/* Отображение существующего отзыва пользователя */}
                    {userReview && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Ваш отзыв</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(userReview.rating)}
                                    <span className="text-sm text-gray-600">
                                        {formatDate(userReview.created_at)}
                                    </span>
                                </div>
                                <p>{userReview.text}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Дополнительная информация */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Информация о книге</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><span className="font-semibold">ID Gutenberg:</span> {book.gutenberg_id}</p>
                        <p><span className="font-semibold">Тип медиа:</span> {book.media_type}</p>
                    </div>
                    <div>
                        <p><span
                            className="font-semibold">Количество скачиваний:</span> {book.download_count.toLocaleString()}
                        </p>
                        <p><span
                            className="font-semibold">Языки:</span> {book.languages.map(lang => lang.code).join(', ')}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Похожие книги</CardTitle>
                </CardHeader>
                <CardContent>
                    {similarBooksLoading ? (
                        <div className="text-muted-foreground">Загрузка...</div>
                    ) : similarBooks.length === 0 ? (
                        <div className="text-muted-foreground text-sm">Нет похожих книг</div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {similarBooks.map(book => (
                                <Card
                                    key={book.book_id}
                                    className="min-w-[220px] max-w-xs flex-shrink-0 hover:bg-muted/50 cursor-pointer transition"
                                    onClick={() => window.location.href = `/books/${book.book_id}`}
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
                </CardContent>
            </Card>


            {/* Tabs с отзывами и цитатами */}
            {userContent && (
                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList>
                        <TabsTrigger value="reviews">
                            Отзывы ({userContent.reviews.length})
                        </TabsTrigger>
                        <TabsTrigger value="quotes">
                            Цитаты ({userContent.quotes.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reviews" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Отзывы читателей</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {userContent.reviews.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        Пока нет отзывов. Станьте первым!
                                    </p>
                                ) : (
                                    userContent.reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-4 last:border-0">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {review.user?.username?.charAt(0).toUpperCase() || 'А'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold">
                                                            {review.user?.first_name || review.user?.username || 'Аноним'}
                                                        </span>
                                                        {renderStars(review.rating)}
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(review.created_at)}
                                                        </span>
                                                    </div>
                                                    <p>{review.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="quotes" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Цитаты из книги</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {userContent.quotes.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        Пока нет цитат. Добавьте первую!
                                    </p>
                                ) : (
                                    userContent.quotes.map((quote) => (
                                        <div key={quote.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                            <blockquote className="text-lg italic mb-2">
                                                "{quote.text}"
                                            </blockquote>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>
                                                    {quote.user?.first_name || quote.user?.username || 'Аноним'}
                                                </span>
                                                {quote.page_reference && (
                                                    <span>• стр. {quote.page_reference}</span>
                                                )}
                                                <span>• {formatDate(quote.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}

            {!isAuthenticated && (
                <Card className="mt-8">
                    <CardContent className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                            Войдите в аккаунт, чтобы оставлять отзывы, добавлять цитаты и книги в избранное
                        </p>
                        <Button>Войти</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}