import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './satoshi.css';
import {BrowserRouter} from "react-router-dom";
import 'flowbite';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { LoginUserAction } from './store/actions/AuthAction.ts';

if(localStorage.token) {
    LoginUserAction(store.dispatch, localStorage.token);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </>,
)