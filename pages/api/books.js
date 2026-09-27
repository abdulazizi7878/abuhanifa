import formidable from "formidable";
import fs from "fs/promises";
import crypto from "crypto";
import cloudinary from "cloudinary";

import { requireAdmin } from "../../lib/auth";

import {
    CreateBookService,
    GetBookByIdService,
    GetBooksService,
    UpdateBookService,
    DeleteBookService,
} from "../../services/book.service";


export const config = {
    api: {
        bodyParser: false,
    },
};


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const UPLOAD_FOLDER =
    "abuhanifa-installation/books/covers";


const MAX_COVER_SIZE =
    4 * 1024 * 1024;


const ALLOWED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
]);


const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);


/**
 * Get file extension
 */
function getExtension(filename = "") {
    const lastDot = filename.lastIndexOf(".");

    if (lastDot === -1) {
        return "";
    }

    return filename
        .substring(lastDot)
        .toLowerCase();
}


/**
 * Get first Formidable field value
 */
function getField(fields, name) {
    const value = fields[name];

    if (Array.isArray(value)) {
        return value[0] || "";
    }

    return value || "";
}


/**
 * Parse multipart form
 */
async function parseForm(req) {
    const form = formidable({
        maxFileSize: MAX_COVER_SIZE,
        maxFiles: 1,
        maxFields: 20,
        allowEmptyFiles: false,
        multiples: false,
        keepExtensions: true,
    });


    return await new Promise((resolve, reject) => {
        form.parse(req, (error, fields, files) => {
            if (error) {
                reject(error);
                return;
            }

            resolve({
                fields,
                files,
            });
        });
    });
}


/**
 * Get cover file
 */
function getCoverFile(files) {
    const file = files.cover;

    if (!file) {
        return null;
    }

    if (Array.isArray(file)) {
        return file[0] || null;
    }

    return file;
}


/**
 * Validate cover file
 */
function validateCoverFile(file) {
    if (!file) {
        throw new Error("Book cover is required");
    }


    if (!file.filepath) {
        throw new Error("Invalid uploaded cover");
    }


    if (file.size > MAX_COVER_SIZE) {
        throw new Error("Book cover must not exceed 4 MB");
    }


    const extension = getExtension(
        file.originalFilename || ""
    );


    if (!ALLOWED_EXTENSIONS.has(extension)) {
        throw new Error(
            "Only JPG, JPEG, PNG and WEBP covers are allowed"
        );
    }


    if (
        file.mimetype &&
        !ALLOWED_MIME_TYPES.has(file.mimetype)
    ) {
        throw new Error(
            "Invalid book cover image type"
        );
    }
}


/**
 * Upload cover to Cloudinary
 */
async function uploadCover(file) {
    validateCoverFile(file);


    const publicId =
        `${UPLOAD_FOLDER}/${crypto.randomUUID()}`;


    const uploaded =
        await cloudinary.v2.uploader.upload(
            file.filepath,
            {
                folder: UPLOAD_FOLDER,
                public_id: publicId.split("/").pop(),
                resource_type: "image",
                type: "upload",
            }
        );


    return {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
        resource_type: uploaded.resource_type,
    };
}


/**
 * Delete Cloudinary cover
 */
async function deleteCloudinaryCover(
    publicId,
    resourceType = "image"
) {
    if (!publicId) {
        return;
    }


    await cloudinary.v2.uploader.destroy(
        publicId,
        {
            resource_type: resourceType,
            type: "upload",
            invalidate: true,
        }
    );
}


/**
 * Main API
 */
export default async function handler(req, res) {

    /*
     * ========================================================
     * AUTHENTICATION
     * ========================================================
     */

    const auth = await requireAdmin(req);


    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }


    /*
     * ========================================================
     * GET
     * ========================================================
     */

    if (req.method === "GET") {
        try {
            const { id, page = 1, limit = 10 } =
                req.query;


            if (id) {
                const book =
                    await GetBookByIdService(id);


                return res.status(200).json({
                    success: true,
                    book,
                });
            }


            const result =
                await GetBooksService({
                    page,
                    limit,
                });


            return res.status(200).json({
                success: true,
                books: result.books,
                pagination: result.pagination,
            });

        } catch (error) {
            console.error(
                "ADMIN GET BOOKS ERROR:",
                error
            );


            const status =
                error.message === "Book not found"
                    ? 404
                    : 400;


            return res.status(status).json({
                success: false,
                message:
                    error.message ||
                    "Failed to load books",
            });
        }
    }


    /*
     * ========================================================
     * POST
     * ========================================================
     */

    if (req.method === "POST") {

        let uploadedCover = null;
        let coverFile = null;


        try {
            const {
                fields,
                files,
            } = await parseForm(req);


            const title =
                getField(fields, "title");

            const description =
                getField(fields, "description");

            const telegramUrl =
                getField(fields, "telegram_url");


            coverFile =
                getCoverFile(files);


            uploadedCover =
                await uploadCover(coverFile);


            const book =
                await CreateBookService({
                    title,
                    description,
                    telegramUrl,

                    coverUrl:
                        uploadedCover.secure_url,

                    coverPublicId:
                        uploadedCover.public_id,

                    coverResourceType:
                        uploadedCover.resource_type,
                });


            try {
                await fs.unlink(
                    coverFile.filepath
                );
            } catch { }


            return res.status(201).json({
                success: true,
                message:
                    "Book created successfully",
                book,
            });

        } catch (error) {

            console.error(
                "ADMIN CREATE BOOK ERROR:",
                error
            );


            /*
             * If Cloudinary succeeded but
             * database creation failed,
             * remove the uploaded cover.
             */

            if (uploadedCover) {
                try {
                    await deleteCloudinaryCover(
                        uploadedCover.public_id,
                        uploadedCover.resource_type
                    );
                } catch (cleanupError) {
                    console.error(
                        "BOOK COVER CLEANUP ERROR:",
                        cleanupError
                    );
                }
            }


            if (coverFile?.filepath) {
                try {
                    await fs.unlink(
                        coverFile.filepath
                    );
                } catch { }
            }


            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Failed to create book",
            });
        }
    }


    /*
     * ========================================================
     * PUT
     * ========================================================
     */

    if (req.method === "PUT") {

        let uploadedNewCover = null;
        let newCoverFile = null;


        try {
            const {
                fields,
                files,
            } = await parseForm(req);


            const id =
                getField(fields, "id");

            if (!id) {
                throw new Error(
                    "Book ID is required"
                );
            }


            const existingBook =
                await GetBookByIdService(id);


            const title =
                getField(fields, "title");

            const description =
                getField(fields, "description");

            const telegramUrl =
                getField(fields, "telegram_url");


            newCoverFile =
                getCoverFile(files);


            /*
             * ==================================================
             * UPDATE WITH NEW COVER
             * ==================================================
             */

            if (newCoverFile) {

                uploadedNewCover =
                    await uploadCover(
                        newCoverFile
                    );


                const updatedBook =
                    await UpdateBookService(
                        id,
                        {
                            title,
                            description,
                            telegramUrl,

                            coverUrl:
                                uploadedNewCover.secure_url,

                            coverPublicId:
                                uploadedNewCover.public_id,

                            coverResourceType:
                                uploadedNewCover.resource_type,
                        }
                    );


                /*
                 * DB update succeeded.
                 * Now remove old cover.
                 */

                try {
                    await deleteCloudinaryCover(
                        existingBook.cover_public_id,
                        existingBook.cover_resource_type
                    );
                } catch (cleanupError) {
                    console.error(
                        "OLD BOOK COVER DELETE ERROR:",
                        cleanupError
                    );
                }


                try {
                    await fs.unlink(
                        newCoverFile.filepath
                    );
                } catch { }


                return res.status(200).json({
                    success: true,
                    message:
                        "Book updated successfully",
                    book: updatedBook,
                });
            }


            /*
             * ==================================================
             * UPDATE WITHOUT NEW COVER
             * ==================================================
             */

            const updatedBook =
                await UpdateBookService(
                    id,
                    {
                        title,
                        description,
                        telegramUrl,

                        coverUrl:
                            existingBook.cover_url,

                        coverPublicId:
                            existingBook.cover_public_id,

                        coverResourceType:
                            existingBook.cover_resource_type,
                    }
                );


            return res.status(200).json({
                success: true,
                message:
                    "Book updated successfully",
                book: updatedBook,
            });

        } catch (error) {

            console.error(
                "ADMIN UPDATE BOOK ERROR:",
                error
            );


            /*
             * If the new cover was uploaded but
             * updating the database failed,
             * delete the NEW cover.
             */

            if (uploadedNewCover) {
                try {
                    await deleteCloudinaryCover(
                        uploadedNewCover.public_id,
                        uploadedNewCover.resource_type
                    );
                } catch (cleanupError) {
                    console.error(
                        "NEW BOOK COVER CLEANUP ERROR:",
                        cleanupError
                    );
                }
            }


            if (newCoverFile?.filepath) {
                try {
                    await fs.unlink(
                        newCoverFile.filepath
                    );
                } catch { }
            }


            const status =
                error.message === "Book not found"
                    ? 404
                    : 400;


            return res.status(status).json({
                success: false,
                message:
                    error.message ||
                    "Failed to update book",
            });
        }
    }


    /*
     * ========================================================
     * DELETE
     * ========================================================
     */

    if (req.method === "DELETE") {

        try {
            const { id } = req.body || {};


            if (!id) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Book ID is required",
                });
            }


            const book =
                await GetBookByIdService(id);


            /*
             * Delete Cloudinary cover FIRST.
             *
             * If this fails, we do not delete
             * the database record.
             */

            await deleteCloudinaryCover(
                book.cover_public_id,
                book.cover_resource_type
            );


            /*
             * Cloudinary deletion succeeded.
             * Now delete DB record.
             */

            await DeleteBookService(id);


            return res.status(200).json({
                success: true,
                message:
                    "Book deleted successfully",
            });

        } catch (error) {

            console.error(
                "ADMIN DELETE BOOK ERROR:",
                error
            );


            const status =
                error.message === "Book not found"
                    ? 404
                    : 400;


            return res.status(status).json({
                success: false,
                message:
                    error.message ||
                    "Failed to delete book",
            });
        }
    }


    /*
     * ========================================================
     * METHOD NOT ALLOWED
     * ========================================================
     */

    return res.status(405).json({
        success: false,
        message: "Method Not Allowed",
    });
}