import { compose } from '@ngrx/core/compose';
import { Store, StoreModule, ActionReducer, combineReducers } from '@ngrx/store';

export type StoreType = {
    state: any,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

export function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
        if (action.type === 'SET_ROOT_STATE') {
            return action.payload;
        }
        return reducer(state, action);
    };
}

export const composeReducer = compose(stateSetter, combineReducers)({
    // Add your reducers here
});

export function rootReducer (state: any, action: any) {
    return composeReducer(state, action);
}