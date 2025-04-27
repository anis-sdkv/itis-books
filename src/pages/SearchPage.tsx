import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(""); // Состояние для жанра
  const [searchResult, setSearchResult] = useState<any[]>([]); // Храним массив всех найденных книг
  const [loading, setLoading] = useState(false);

  // Список жанров (можно добавить другие жанры, если нужно)
  const genres = ["Фантастика", "Научная литература", "История", "Детские книги", "Кулинария"];

  const handleSearch = async () => {
    if (query.trim() !== "") {
      setLoading(true);
      try {
        // Формируем запрос к Google Books API с фильтром по жанру, если выбран
        const genreQuery = genre ? `+subject:${genre}` : "";
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}${genreQuery}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          // Обрабатываем данные и сохраняем книги в состояние
          const books = data.items.map((item: any) => ({
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.join(", ") || "Неизвестный автор",
            thumbnail: item.volumeInfo.imageLinks?.thumbnail,
            genre: item.volumeInfo.categories?.join(", ") || "Неизвестный жанр",
          }));
          setSearchResult(books);
        } else {
          setSearchResult([]);
        }
      } catch (error) {
        setSearchResult([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResult([]);
    }
  };

  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-semibold">Поиск книг</h1>
      <p className="text-muted-foreground">Введите название книги для поиска.</p>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Название книги..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
      />

      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md mt-4"
      >
        <option value="">Все жанры</option>
        {genres.map((g, index) => (
          <option key={index} value={g}>
            {g}
          </option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg mt-4"
      >
        Найти
      </button>

      {loading && <p className="text-lg text-muted-foreground">Загрузка...</p>}

      {searchResult.length > 0 && (
        <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-6">
          {searchResult.map((book, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg">
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <h3 className="text-lg font-semibold mt-4">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              <p className="text-sm text-muted-foreground">{book.genre}</p>
            </div>
          ))}
        </div>
      )}

      {searchResult.length === 0 && !loading && (
        <p className="text-lg text-muted-foreground">Книги не найдены.</p>
      )}
    </section>
  );
}
