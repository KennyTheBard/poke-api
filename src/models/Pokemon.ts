import mongoose, { Document, Schema } from "mongoose";
import { ZodType, z } from "zod";

export interface Ability {
    hidden: boolean;
    slot: number;
    abilityName: string;
}

export interface HeldItem {
    itemName: string;
    itemUrl: string;
}

export interface IPokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: Ability[];
    heldItem: HeldItem | null;
}

export const AbilitySchema: ZodType<Ability> = z.object({
    hidden: z.boolean(),
    slot: z.number(),
    abilityName: z.string(),
});

export const HeldItemSchema: ZodType<HeldItem> = z.object({
    itemName: z.string(),
    itemUrl: z.string(),
});

export const IPokemonSchema: ZodType<IPokemon> = z.object({
    id: z.number(),
    name: z.string(),
    height: z.number(),
    weight: z.number(),
    abilities: z.array(AbilitySchema),
    heldItem: HeldItemSchema.or(z.null()),
});

const pokemonSchema = new Schema<IPokemon>({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    abilities: [
        {
            hidden: {
                type: Boolean,
                required: true,
            },
            slot: {
                type: Number,
                required: true,
            },
            abilityName: {
                type: String,
                required: true,
            },
        },
    ],
    heldItem: {
        itemName: String,
        itemUrl: String,
    },
});

const Pokemon = mongoose.model<IPokemon>("Pokemon", pokemonSchema);

export default Pokemon;
