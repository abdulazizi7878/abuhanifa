import Joi from "joi";

const languageSchema = Joi.string()
    .trim()
    .lowercase()
    .min(2)
    .max(10)
    .required();

const translationSchema = Joi.object({
    language: languageSchema,

    translatedText: Joi.string()
        .trim()
        .min(1)
        .max(10000)
        .required()
});

export const createReviewSchema = Joi.object({
    customerName: Joi.string()
        .trim()
        .min(1)
        .max(150)
        .required(),

    originalText: Joi.string()
        .trim()
        .min(1)
        .max(10000)
        .required(),

    originalLanguage: languageSchema,

    translations: Joi.array()
        .items(translationSchema)
        .default([]),

    isPublished: Joi.boolean()
        .default(true)
});