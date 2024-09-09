import convict from "convict";
import validators from "convict-format-with-validator";

convict.addFormats(validators);

export type RestSchema = {
    PORT: number;
    SALT: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_PORT: string;
    DB_NAME: string;
    JWT_SECRET: string;
}

export const configRestSchema = convict<RestSchema>({
    PORT: {
        doc: 'Port for incoming connection',
        format: "port",
        env: 'PORT',
        default: 5000
    },
    SALT: {
        doc: 'Salt for password hash',
        format: String,
        env: 'SALT',
        default: null
    },
    DB_HOST: {
        doc: 'IP address of the database server',
        format: 'ipaddress',
        env: 'DB_HOST',
        default: '127.0.0.1'
    },
    DB_USER: {
        doc: 'Username to connect to the database',
        format: String,
        env: 'DB_USER',
        default: null,
    },
    DB_PASSWORD: {
        doc: 'Password to connect to the database',
        format: String,
        env: 'DB_PASSWORD',
        default: null,
    },
    DB_PORT: {
        doc: 'Port to connect to the database (MongoDB)',
        format: 'port',
        env: 'DB_PORT',
        default: '27017',
    },
    DB_NAME: {
        doc: 'Database name (MongoDB)',
        format: String,
        env: 'DB_NAME',
        default: 'buy-and-sell'
    },
    JWT_SECRET: {
        doc: 'Secret fo sign JWT',
        format: String,
        env: 'JWT_SECRET',
        default: null
    }
});