export const SET_CARD_IMAGES = 'setCardImages';

export const setCardImages = (cardImages) => {
    return {
        type: SET_CARD_IMAGES,
        payload: cardImages,
    }
}