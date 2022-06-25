import { setEnvironment } from '@owlprotocol/vite-demo-components';

//default values
const customEnv = {
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_RPC_URL: import.meta.env.VITE_RPC_URL,
};

setEnvironment(customEnv);
