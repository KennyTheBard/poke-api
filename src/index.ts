import mongoose from "mongoose";
import { appConfig } from "./config";
import cors from "cors";
import express from "express";
import { createPokemon, updatePokemon, deletePokemon, getOnePokemon, getAllPokemons, deleteAllPokemons, populateDatabase } from "./routes";
import { PokemonService } from "./services";

const bootstrap = async () => {
    // init database connection
    await mongoose.connect(
        `mongodb://${appConfig.mongo.host}:${appConfig.mongo.port}/${appConfig.mongo.database}`,
        {
            user: appConfig.mongo.username,
            pass: appConfig.mongo.password,
        }
    );

    // init services
    const pokemonService = new PokemonService();

    // init server
    const app = express();
    app.use(cors());
    app.use(express.json());

    // defined routes
    app.post("/pokemons", createPokemon);
    app.put("/pokemons/:id", updatePokemon);
    app.delete("/pokemons/:id", deletePokemon);
    app.get("/pokemons/:id", getOnePokemon);
    app.get("/pokemons", getAllPokemons);
    app.delete("/pokemons", deleteAllPokemons);
    app.post("/populate-database", populateDatabase(pokemonService));

    // start server
    app.listen(appConfig.port, () =>
        console.log(`Server is listening on port ${appConfig.port}`)
    );
};
bootstrap();
