import {
    CreateBook,
    GetBookById,
    GetBooks,
    UpdateBook,
    DeleteBook,
} from "../repositories/book.repository";


const ALLOWED_COVER_RESOURCE_TYPES = ["image"];


/**
 * Validate Telegram URL
 */
function validateTelegramUrl(url) {
    if (!url || typeof url !== "string") {
        throw new Error("Telegram PDF link is required");
    }

    const trimmedUrl = url.trim();

    let parsedUrl;

    try {
        parsedUrl = new URL(trimmedUrl);
    } catch {
        throw new Error("Invalid Telegram PDF link");
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    if (
        parsedUrl.protocol !== "https:" ||
        !(
            hostname === "t.me" ||
            hostname === "telegram.me" ||
            hostname === "www.t.me"
        )
    ) {
        throw new Error("Please provide a valid Telegram link");
    }

    return trimmedUrl;
}


/**
 * Validate cover URL
 */
function validateCoverUrl(url) {
    if (!url || typeof url !== "string") {
        throw new Error("Book cover URL is required");
    }

    return url.trim();
}


/**
 * Validate Cloudinary public ID
 */
function validateCoverPublicId(publicId) {
    if (!publicId || typeof publicId !== "string") {
        throw new Error("Book cover public ID is required");
    }

    return publicId.trim();
}


/**
 * Clean optional text
 */
function cleanOptionalText(value) {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();

    return trimmed ? trimmed : null;
}


/**
 * Create book
 */
export async function CreateBookService({
    title,
    description,
    telegramUrl,
    coverUrl,
    coverPublicId,
    coverResourceType = "image",
}) {
    const validatedTelegramUrl = validateTelegramUrl(telegramUrl);

    const validatedCoverUrl = validateCoverUrl(coverUrl);

    const validatedCoverPublicId =
        validateCoverPublicId(coverPublicId);


    if (
        !ALLOWED_COVER_RESOURCE_TYPES.includes(
            coverResourceType
        )
    ) {
        throw new Error(
            `Invalid cover resource type: ${coverResourceType}`
        );
    }


    return await CreateBook({
        title: cleanOptionalText(title),
        description: cleanOptionalText(description),
        telegramUrl: validatedTelegramUrl,
        coverUrl: validatedCoverUrl,
        coverPublicId: validatedCoverPublicId,
        coverResourceType,
    });
}


/**
 * Get one book
 */
export async function GetBookByIdService(id) {
    if (!id) {
        throw new Error("Book ID is required");
    }

    const book = await GetBookById(id);

    if (!book) {
        throw new Error("Book not found");
    }

    return book;
}


/**
 * Get books with pagination
 */
export async function GetBooksService({
    page = 1,
    limit = 10,
} = {}) {
    const numericPage = Number(page);
    const numericLimit = Number(limit);


    if (
        !Number.isInteger(numericPage) ||
        numericPage < 1
    ) {
        throw new Error("Invalid page number");
    }


    if (
        !Number.isInteger(numericLimit) ||
        numericLimit < 1
    ) {
        throw new Error("Invalid limit");
    }


    return await GetBooks({
        page: numericPage,
        limit: numericLimit,
    });
}


/**
 * Update book metadata only
 *
 * The API can pass the existing cover information
 * when no new cover was uploaded.
 */
export async function UpdateBookService(
    id,
    {
        title,
        description,
        telegramUrl,
        coverUrl,
        coverPublicId,
        coverResourceType = "image",
    }
) {
    if (!id) {
        throw new Error("Book ID is required");
    }


    const existingBook = await GetBookById(id);

    if (!existingBook) {
        throw new Error("Book not found");
    }


    const validatedTelegramUrl =
        validateTelegramUrl(telegramUrl);

    const validatedCoverUrl =
        validateCoverUrl(coverUrl);

    const validatedCoverPublicId =
        validateCoverPublicId(coverPublicId);


    if (
        !ALLOWED_COVER_RESOURCE_TYPES.includes(
            coverResourceType
        )
    ) {
        throw new Error(
            `Invalid cover resource type: ${coverResourceType}`
        );
    }


    await UpdateBook(id, {
        title: cleanOptionalText(title),
        description: cleanOptionalText(description),
        telegramUrl: validatedTelegramUrl,
        coverUrl: validatedCoverUrl,
        coverPublicId: validatedCoverPublicId,
        coverResourceType,
    });


    return await GetBookById(id);
}


/**
 * Delete book
 */
export async function DeleteBookService(id) {
    if (!id) {
        throw new Error("Book ID is required");
    }


    const book = await GetBookById(id);

    if (!book) {
        throw new Error("Book not found");
    }


    const result = await DeleteBook(id);


    return {
        book,
        result,
    };
}