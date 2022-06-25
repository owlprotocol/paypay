import { getEnvironment } from '../../environment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AppTitle = (_: any) => {
    return (
        <ul>
            <li>title: {getEnvironment().VITE_APP_TITLE}</li>
        </ul>
    );
};
