import mongoose from "mongoose";
import { appConfig } from "./config";

const bootstrap = async () => {
    // init database connection
    await mongoose.connect(
        `mongodb://${appConfig.mongo.host}:${appConfig.mongo.port}/${appConfig.mongo.database}`, {
            user: appConfig.mongo.username,
            pass: appConfig.mongo.password
        }
    );
};
bootstrap();
