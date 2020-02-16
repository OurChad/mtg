export const ADD_CARD_IMAGES = 'addCardImages';
export const RESET_CARD_IMAGES = 'resetCardImages';

export const addCardImages = (cardImages) => {
    return {
        type: ADD_CARD_IMAGES,
        payload: cardImages,
    }
}