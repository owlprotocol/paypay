import { Button, AppTitle, Web3LatestBlockNo } from './components';
import logo from './logo.svg';
import './App.css';

function App() {
    //https://vitejs.dev/guide/env-and-mode.html#env-variables
    const metaTitle = import.meta.env.VITE_APP_TITLE;

    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <p>
                    App Env Vars
                    <ul>
                        <li>metaTitle: {metaTitle}</li>
                    </ul>
                </p>
                <p>
                    Component Library Env Vars
                    <AppTitle />
                </p>
                <p>
                    <Button label='primary' />
                </p>
                <p>
                    <Web3LatestBlockNo />
                </p>
                <p>
                    Edit <code>App.tsx</code> and save to test HMR updates.
                </p>
                <p>
                    <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
                        Learn React
                    </a>
                    {' | '}
                    <a
                        className='App-link'
                        href='https://vitejs.dev/guide/features.html'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Vite Docs
                    </a>
                </p>
            </header>
        </div>
    );
}

export default App;
