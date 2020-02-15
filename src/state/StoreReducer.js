import { SET_CARD_IMAGES } from './StoreActions';

export const INITIAL_STATE = {
    cardImages: [],
};

export const storeReducer = (state = [], { type, payload }) => {
    switch (type) {
        case SET_CARD_IMAGES:
            return {
                ...state,
                cardImages: [...state.cardImages, payload],
            };
        default:
            return state;
    }
};
