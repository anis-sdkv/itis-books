import {useParams} from "react-router-dom";
import {ReactReader} from "react-reader";
import {useState, useEffect} from "react";
import {BASE_URL} from "@/config";

export default function ReaderPage() {
    const {id} = useParams<{ id: string }>();
    const bookUrl = `${BASE_URL}/media/books/${id}.epub/`;
    const [location, setLocation] = useState<string | number>(0);
    const [fileExists, setFileExists] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;
        // HEAD-запрос — быстро узнаём, существует ли файл
        fetch(bookUrl, {method: "HEAD"})
            .then(res => {
                if (isMounted) setFileExists(res.ok);
            })
            .catch(() => {
                if (isMounted) setFileExists(false);
            });
        return () => {
            isMounted = false
        };
    }, [bookUrl]);

    if (fileExists === null) return <div>Проверка наличия файла…</div>;
    if (fileExists === false) return <div style={{color: "crimson"}}>Файл книги не найден 😢</div>;

    return (
        <div style={{height: "100vh"}}>
            <ReactReader
                url={bookUrl}
                location={location}
                locationChanged={setLocation}
                showToc
                styles={{
                    readerArea: {background: "#f8f8fa"},
                    container: {boxShadow: "0 4px 24px 0 rgba(0,0,0,.05)"},
                }}
            />
        </div>
    );
}
