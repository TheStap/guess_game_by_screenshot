import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import 'fontsource-roboto';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
    <React.StrictMode>
        <SnackbarProvider
            autoHideDuration={2000}
            maxSnack={1}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Provider store={store}>
                <App/>
            </Provider>
        </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
