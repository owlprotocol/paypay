import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { store, Environment } from '@owlprotocol/web3-redux';
import './index.css';
import theme from './theme';
import App from './App';

Environment.setEnvironment({
    VITE_APP_TITLE: 'Hello Clarence',
    VITE_INFURA_API_KEY: 'e0db9a03a0af4178b8928555d7924595',
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);
