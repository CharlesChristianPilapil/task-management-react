// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from '@/app/App';
import { store } from '@/store';

import './index.css';

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    //     <ReduxProvider store={store}>
    //         <BrowserRouter>
    //             <App />
    //         </BrowserRouter>
    //     </ReduxProvider>
    // </StrictMode>,
    <ReduxProvider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ReduxProvider>,
);
