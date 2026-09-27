import {
    GetBookByIdService,
    GetBooksService,
} from "../../services/book.service";


export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }


    try {
        const {
            id,
            page = 1,
            limit = 10,
        } = req.query;


        /*
         * =====================================================
         * SINGLE BOOK
         * =====================================================
         */

        if (id) {

            const book =
                await GetBookByIdService(id);


            return res.status(200).json({
                success: true,

                book: {
                    id: book.id,
                    title: book.title,
                    description: book.description,
                    telegram_url: book.telegram_url,
                    cover_url: book.cover_url,
                    created_at: book.created_at,
                    updated_at: book.updated_at,
                },
            });
        }


        /*
         * =====================================================
         * PAGINATED BOOKS
         * =====================================================
         */

        const result =
            await GetBooksService({
                page,
                limit,
            });


        const publicBooks =
            result.books.map((book) => ({
                id: book.id,
                title: book.title,
                description: book.description,
                telegram_url: book.telegram_url,
                cover_url: book.cover_url,
                created_at: book.created_at,
                updated_at: book.updated_at,
            }));


        return res.status(200).json({
            success: true,
            books: publicBooks,
            pagination: result.pagination,
        });

    } catch (error) {

        console.error(
            "PUBLIC BOOKS API ERROR:",
            error
        );


        if (error.message === "Book not found") {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to load books",
        });
    }
}