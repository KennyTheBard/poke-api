import { z } from "zod";

export const IdParamSchema = z
    .string()
    .refine((value) => /^\d+$/.test(value), {
        message:
            "Invalid ID format. ID should be a string containing only digits.",
    })
    .transform((value) => parseInt(value, 10));
