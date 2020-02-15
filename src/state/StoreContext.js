import React, { useReducer, useContext } from 'react';
import {INITIAL_STATE, storeReducer} from './StoreReducer';

export const StoreContext = React.createContext({});
export const StoreDispatchContext = React.createContext(null);

export const StoreContextProvider  = ({ children }) => {
    const [state, dispatch] = useReducer(storeReducer, INITIAL_STATE);

    return (
        <StoreDispatchContext.Provider value={dispatch}>
            <StoreContext.Provider value={state}>
                {children}
            </StoreContext.Provider>
        </StoreDispatchContext.Provider>
    );
};

export const useStore = () => {
    const state = useContext(StoreContext);
    const dispatch = useContext(StoreDispatchContext);
    
    return [state, dispatch];
}