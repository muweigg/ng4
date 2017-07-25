import { ActionReducer, Action } from '@ngrx/store';

export const SET_ROOT_STATE = 'SET_ROOT_STATE';

export class SetState implements Action {
    readonly type = SET_ROOT_STATE;
    constructor(public payload: any) { }
}

export type StoreType = {
    state: any,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

export type SetStateAction = SetState;

export function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action: SetStateAction) {
        if (action.type === SET_ROOT_STATE) {
            return action.payload;
        }
        return reducer(state, action);
    };
}

export const metaReducers = [stateSetter];
