import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return [...state, payload];     // This payload will have msg, id, type 
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);    // Payload can be whatever we want(data), but in this case it's gonna be just an id.
        default:
            return state;
    }
}
