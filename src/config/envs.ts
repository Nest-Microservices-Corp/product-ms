import 'dotenv/config';
import * as joi from 'joi';

interface IEnvironments {
    PORT: number;
    DATABASE_URL: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required()
})
.unknown( true );

const { error, value } = envSchema.validate( process.env );

if( error ) {
    throw new Error(`Config validation falied: ${ error.message }`);
}

const envVars: IEnvironments = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL
};
