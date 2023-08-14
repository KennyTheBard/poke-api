import { Request, Response } from "express";
import Pokemon, { IPokemon, IPokemonSchema } from "../models/Pokemon";
import { IdParamSchema } from "../utils";
import { PokemonService } from "../services";

export const createPokemon = async (req: Request, res: Response) => {
    try {
        const newPokemonData: IPokemon = IPokemonSchema.parse(req.body);
        const newPokemon = await Pokemon.create(newPokemonData);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(500).json({ message: "Error creating pokemon", error });
    }
};

export const updatePokemon = async (req: Request, res: Response) => {
    try {
        const id: number = IdParamSchema.parse(req.params.id);
        const updatedPokemonData: IPokemon = IPokemonSchema.parse(req.body);

        const updatedPokemon = await Pokemon.findByIdAndUpdate(
            id,
            updatedPokemonData,
            { new: true }
        );
        if (updatedPokemon) {
            res.json(updatedPokemon);
        } else {
            res.status(404).json({ message: "Pokemon not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating pokemon", error });
    }
};

export const deletePokemon = async (req: Request, res: Response) => {
    try {
        const id: number = IdParamSchema.parse(req.params.id);

        const deletedPokemon = await Pokemon.findByIdAndDelete(id);
        if (deletedPokemon) {
            res.json(deletedPokemon);
        } else {
            res.status(404).json({ message: "Pokemon not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting pokemon", error });
    }
};

export const getOnePokemon = async (req: Request, res: Response) => {
    try {
        const id: number = IdParamSchema.parse(req.params.id);

        const foundPokemon = await Pokemon.findById(id);
        if (foundPokemon) {
            res.json(foundPokemon);
        } else {
            res.status(404).json({ message: "Pokemon not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching pokemon details",
            error,
        });
    }
};

export const getAllPokemons = async (req: Request, res: Response) => {
    try {
        const sortedPokemons = await Pokemon.find().sort({ weight: -1 });
        res.json(sortedPokemons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pokemons", error });
    }
};

export const deleteAllPokemons = async (req: Request, res: Response) => {
    try {
        await Pokemon.deleteMany();
        res.json({ message: "All pokemons deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pokemons", error });
    }
};

export const populateDatabase = (pokemonService: PokemonService) => async (req: Request, res: Response) => {
    const count = await Pokemon.countDocuments();
    if (count >= 100) {
        return;
    }

    await pokemonService.refreshPokemons();
}
