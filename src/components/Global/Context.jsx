import { createContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase';

const GlobalState = createContext();

const Context = ({ children }) => {
    const [projects, setProjects] = useState([])
    return (
        <GlobalState.Provider value={{ projects, setProjects }}>
            {children}
        </GlobalState.Provider>
    );
};

export {GlobalState, Context}