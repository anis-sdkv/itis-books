import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Захардкоженные данные о книгах
const books = [
    {
        id: 1,
        title: "Пиши, сокращай!",
        description: "Знаменитое пособие о том, как писать хорошо: впервые в электронном формате!",
        category: "Саморазвитие"
    },
    {
        id: 2,
        title: "Думай о себе: как перестать всем угождать и обрести уверенность",
        description: "",
        category: "Психология"
    },
    {
        id: 3,
        title: "Выжить после ядерной войны. Первая часть знаменитой постапокалиптической саги",
        description: "",
        category: "Фантастика"
    },
    {
        id: 4,
        title: "Кратко и по делу: как составлять продукт",
        description: "",
        category: "Бизнес"
    }
];

// Рекомендуемые книги
const recommendedBooks = [
    {
        id: 1,
        title: "Мужские правила: Отношения, секс,...",
        author: "Марк Мэнесин"
    },
    {
        id: 2,
        title: "Богатый папа, бедный папа",
        author: "Роберт Кийосаки"
    },
    {
        id: 3,
        title: "Цель. Процесс непрерывного...",
        author: "Джефф Кокс, Элияху Голдратт"
    },
    {
        id: 4,
        title: "Если все кошки в мире исчезнут",
        author: "Гэнси Кавамура"
    },
    {
        id: 5,
        title: "Хватит быть славным парнем! Как добиться...",
        author: "Роберт Гловер"
    },
    {
        id: 6,
        title: "Бусидо. Кодекс самоуправления",
        author: "Миямото Мусаси, Юдза..."
    },
    {
        id: 7,
        title: "Технический анализ: Полный курс",
        author: "Джек Швагер"
    }
];

// Категории книг
const categories = [
    "Бесплатно", "Саморазвитие", "Фантастика", "Классика", "Бизнес",
    "Психология", "Проза", "Нон-фикшн", "Романтика", "Фэнтези",
    "Young Adult", "История", "Детективы", "Биографии и мемуары",
    "Здоровье", "Триллеры и хорроры"
];

export default function MainPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Все книги</h1>

            {/* Фильтры по категориям */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                    <Button key={category} variant="outline">
                        {category}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Основной контент с книгами */}
                <div className="md:col-span-2 space-y-6">
                    {books.map((book) => (
                        <Card key={book.id}>
                            <CardHeader>
                                <CardTitle>{book.title}</CardTitle>
                                {book.category && (
                                    <span className="text-sm text-muted-foreground">{book.category}</span>
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">{book.description}</p>
                                <Button>Читать</Button>
                            </CardContent>
                        </Card>
                    ))}
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
                            <Progress value={33} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Прогресс обновляется раз в сутки
                            </p>
                        </CardContent>
                    </Card>

                    {/* Рекомендуемые книги */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Вам может понравиться</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recommendedBooks.map((book) => (
                                <div key={book.id} className="border-b pb-4 last:border-0 last:pb-0">
                                    <h4 className="font-medium">{book.title}</h4>
                                    <p className="text-sm text-muted-foreground">{book.author}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}