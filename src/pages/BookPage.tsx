import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, Plus } from "lucide-react";

export default function BookPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* Заголовок и кнопки */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Обложка книги */}
                <div className="w-full md:w-1/3">
                    <img
                        src="/placeholder-book.jpg"
                        alt="Обложка книги"
                        className="rounded-lg shadow-md w-full h-auto"
                    />
                </div>

                {/* Информация о книге */}
                <div className="w-full md:w-2/3 space-y-4">
                    <h1 className="text-3xl font-bold">Python для начинающих</h1>
                    <p className="text-gray-600">Автор: Иван Иванов</p>

                    <div className="flex gap-4">
                        <Button className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4" />
                            Читать
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            В избранное
                        </Button>
                    </div>

                    <div className="pt-4">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList>
                                <TabsTrigger value="description">Описание</TabsTrigger>
                                <TabsTrigger value="reviews">Впечатления (49)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="pt-4">
                                <p>
                                    Программирование на языке Python — популярный вид написания кода, который широко используется для решения задач совершенно разного уровня. Софт, созданный на основе данного языка, применяется компаниями и частными лицами.
                                </p>
                                <p className="mt-2">
                                    Просто в освоении. По сравнению с другими языками, Python достаточно...
                                </p>
                            </TabsContent>

                            <TabsContent value="reviews" className="pt-4">
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src="/avatars/marat.jpg" />
                                                <AvatarFallback>М</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle>Марат</CardTitle>
                                                <p className="text-sm text-muted-foreground">2 года назад</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Отличная книга для старта! Все понятно объяснено.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Дополнительная информация */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Информация о книге</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><span className="font-semibold">Правообладатель:</span> ООО "Издательские решения"</p>
                        <p><span className="font-semibold">Дата публикации оригинала:</span> 2020</p>
                    </div>
                    <div>
                        <p><span className="font-semibold">Год выхода издания:</span> 2020</p>
                        <p><span className="font-semibold">Издательство:</span> Ridero</p>
                        <p><span className="font-semibold">Бумажных страниц:</span> 193</p>
                    </div>
                </CardContent>
            </Card>

            {/* Блок с впечатлениями */}
            <Card>
                <CardHeader>
                    <CardTitle>Впечатления (49)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src="/avatars/marat.jpg" />
                            <AvatarFallback>М</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">Марат</p>
                                <p className="text-sm text-muted-foreground">делится впечатлением • 2 года назад</p>
                            </div>
                            <p className="mt-1">Отличная книга для старта! Все понятно объяснено.</p>
                        </div>
                    </div>
                    {/* Здесь можно добавить больше комментариев */}
                </CardContent>
                <CardFooter>
                    <Button variant="outline">Показать еще</Button>
                </CardFooter>
            </Card>
        </div>
    );
}