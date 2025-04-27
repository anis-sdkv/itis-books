import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

// Захардкоженные данные о книгах
const favoriteBooks = [
    {
        id: 1,
        title: "Пиши, сокращай!",
        author: "Максим Ильяхов, Людмила Сарычева",
        status: "Читаю"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        status: "В планах"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        status: "Прочитано"
    },
    {
        id: 4,
        title: "Гарри Поттер и философский камень",
        author: "Дж. К. Роулинг",
        status: "Прочитано"
    }
];

export default function MyBooksPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Здесь будут книги, которые вы начнете читать</h1>
                <Button asChild>
                    <Link to="/my-books/create-shelf">Создать полку</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Button variant="outline" className="h-12">
                    Найти что почитать
                </Button>
                <Button variant="outline" className="h-12">
                    загрузить книгу
                </Button>
                <Button variant="outline" className="h-12">
                    мои достижения
                </Button>
                <Button variant="outline" className="h-12">
                    авторы
                </Button>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Книги</h2>
                <div className="flex space-x-4 mb-6">
                    <Button variant="ghost">Открытие</Button>
                    <Button variant="ghost">Добавленные</Button>
                    <Button variant="ghost">Законченные</Button>
                    <Button variant="ghost">Загрузки</Button>
                    <Button variant="ghost">Все</Button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Все текстовые</h2>
                <p className="text-muted-foreground mb-6">Здесь будут все ваши книги</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteBooks.map((book) => (
                        <Card key={book.id}>
                            <CardHeader>
                                <CardTitle>{book.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{book.author}</p>
                            </CardHeader>
                            <CardContent>
                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {book.status}
                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}