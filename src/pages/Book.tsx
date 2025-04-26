import {Button} from "@/components/ui/button";

export default function Book() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <h2 className="text-xl text-gray-600 mb-4">Автор: {book.author}</h2>
                <p className="text-gray-700 mb-6">{book.description}</p>
                <Button variant="primary">Добавить в корзину</Button>
            </div>
        </div>
    );
}