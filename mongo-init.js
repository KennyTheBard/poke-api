db = db.getSiblingDB('pokemon_database');

db.createUser({
    user: "test",
    pwd: "password",
    roles: [
        { role: 'dbOwner', db: 'pokemon_database' }
    ],
});

db.createCollection('pokemons');
