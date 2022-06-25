import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './environment';
import './index.css';
import theme from './theme'
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider
            theme={{
                ...theme,
                fonts: {
                    heading: '"Manrope", sans-serif',
                    body: '"Manrope", sans-serif',
                },
            }}
        >
            <App />
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
