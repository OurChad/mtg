import { ADD_CARD_IMAGES, RESET_CARD_IMAGES } from './StoreActions';

export const INITIAL_STATE = {
    cardImages: [],
};

export const storeReducer = (state = [], { type, payload }) => {
    switch (type) {
        case ADD_CARD_IMAGES:
            return {
                ...state,
                cardImages: [...state.cardImages, payload],
            };
        case RESET_CARD_IMAGES:
            return {
                ...state,
                cardImages: [],
            };
        default:
            return state;
    }
};
