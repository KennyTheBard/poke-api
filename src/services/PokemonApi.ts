import axios from "axios";
import Pokemon, { IPokemon } from "../models/Pokemon";

export class PokemonService {
    public refreshPokemons = async (): Promise<number> => {
        const response = await axios.get(
            "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const pokemonEntries = response.data.results as PokemonListEntry[];

        // TODO: could use some batching
        const requests = await Promise.allSettled(
            pokemonEntries.map((pokemonEntry) => axios.get(pokemonEntry.url))
        );

        let newPokemonCount = 0;
        for (const request of requests) {
            if (request.status === "rejected") {
                console.error(request.reason);
                continue;
            }
            const pokemon = request.value.data as PokemonData;

            // check if pokemon exists
            const existingPokemon = await Pokemon.findOne({
                id: pokemon.id,
            });
            if (existingPokemon !== null) {
                console.log(`Skipping pokemon #${pokemon.id} (${pokemon.name})`)
                continue;
            }

            await Pokemon.create(this.pokemonDataToModel(pokemon));
            console.log(`Updated pokemon #${pokemon.id} (${pokemon.name})`)
            newPokemonCount += 1;
        }

        return newPokemonCount;
    };

    private pokemonDataToModel = (pokemon: PokemonData): IPokemon => {
        return {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            abilities: pokemon.abilities.map((ability) => ({
                hidden: ability.is_hidden,
                slot: ability.slot,
                abilityName: ability.ability.name,
            })),
            heldItem:
                pokemon.held_items.length > 0
                    ? {
                          itemName: pokemon.held_items[0].item.name,
                          itemUrl: pokemon.held_items[0].item.url,
                      }
                    : null,
        } as IPokemon;
    };
}

export type PokemonListEntry = {
    name: string;
    url: string;
};

export type AbilityData = {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
};

export type MoveData = {
    move: {
        name: string;
        url: string;
    };
};

export type StatData = {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
};

export type TypeData = {
    slot: number;
    type: {
        name: string;
        url: string;
    };
};

export type HeldItemData = {
    item: {
        name: string;
        url: string;
    };
};

export type PokemonData = {
    abilities: AbilityData[];
    base_experience: number;
    height: number;
    held_items: HeldItemData[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: MoveData[];
    name: string;
    order: number;
    species: {
        name: string;
        url: string;
    };
    stats: StatData[];
    types: TypeData[];
    weight: number;
};
