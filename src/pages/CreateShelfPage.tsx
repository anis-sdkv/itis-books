import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router-dom';

export default function CreateShelfPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Название</h1>
            <p className="text-muted-foreground mb-8">100 символов</p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Описание полки</h2>
                    <p className="text-muted-foreground mb-4">
                        Расскажите о чем ваша полка, кому интересно на нее подписаться
                        <br />
                        300 символов
                    </p>
                    <Textarea
                        placeholder="Опишите вашу полку..."
                        className="min-h-[120px]"
                    />
                </div>

                <div className="flex space-x-4">
                    <Button asChild>
                        <Link to="/my-books">Создать полку и перейти к добавлению книг</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/my-books">Отмена</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}