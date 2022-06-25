// theme.ts

import { extendTheme } from '@chakra-ui/react';

const themeOverrides = {
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'bold',
                color: '#fff',
                borderRadius: '12px',
                backgroundColor: '#6E87EC !important',
                _hover: {
                    backgroundColor: '#3C5FEC !important',
                },
            },
            variants: {
                secondary: {
                    color: '#fff',
                    backgroundColor: '#4F4F50 !important',
                    _hover: {
                        backgroundColor: '#888 !important',
                    },
                },
            },
        },
        fonts: {
            heading: '"Manrope", sans-serif',
            body: '"Manrope", sans-serif',
        },
    },
    fonts: {
        heading: '"Manrope", sans-serif',
        body: '"Manrope", sans-serif',
    },
};

// @ts-ignore
const theme: any = extendTheme(themeOverrides);

export default theme;
