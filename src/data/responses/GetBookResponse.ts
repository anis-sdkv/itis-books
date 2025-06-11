import {PaginatedResponse} from "@/data/responses/PaginatedResponse";
import { BookModel } from "../models/BookModel";

export type GetBooksResponse = PaginatedResponse<BookModel>;