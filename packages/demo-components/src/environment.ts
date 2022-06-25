import { ImportMetaEnv } from './vite-env';

let environment = {
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_RPC_URL: import.meta.env.VITE_RPC_URL,
} as ImportMetaEnv;

export const setEnvironment = (env: Partial<ImportMetaEnv>) => {
    //Merge
    environment = { ...environment, ...env };
};

export const getEnvironment = () => {
    return environment;
};
