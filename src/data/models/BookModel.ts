// models/AuthorModel.ts
export interface AuthorModel {
    id: number;
    name: string;
    birth_year: number;
    death_year: number;
    years: string;
}

// models/LanguageModel.ts
export interface LanguageModel {
    id: number;
    code: string;
}

// models/BookModel.ts
export interface BookModel {
    gutenberg_id: number;
    title: string;
    authors: AuthorModel[];
    languages: LanguageModel[];
    download_count: number;
    media_type: string;
}