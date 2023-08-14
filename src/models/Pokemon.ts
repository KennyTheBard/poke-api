import mongoose, { Document, Schema } from "mongoose";

interface Ability {
    hidden: boolean;
    slot: number;
    abilityName: string;
}

interface HeldItem {
    itemName: string;
    itemUrl: string;
}

interface IPokemon extends Document {
    name: string;
    height: number;
    weight: number;
    abilities: Ability[];
    heldItem: HeldItem | null;
}

const pokemonSchema = new Schema<IPokemon>({
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
