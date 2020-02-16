import React, { useState, useCallback } from 'react';
import { useStore } from './state/StoreContext';
import { addCardImages, RESET_CARD_IMAGES } from './state/StoreActions';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import Header from './Header';
import Button from './Button';

const StyledMain = styled.main`
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
`;

const FileInput = styled.input`
    border: 1px solid black;
    padding: 1rem;
`;

const FileDropZone = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 40vh;
    border: 1px solid black;
    margin-bottom: 1rem;
`;

function Home() {
    const [{ cardImages }, dispatch] = useStore();
    const [failedCardSearches, setFailedCardSearches] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const getCardCollectionData = useCallback(async (cards) => {
        const loopIncrement = 70;
        const cardPromises = [];
        for(let i = 0; i < cards.length; i += loopIncrement) {
            const data = {
                identifiers: [],
            };
            if (i + loopIncrement > cards.length) {
                data.identifiers = cards.slice(i, cards.length);
            } else {
                data.identifiers = cards.slice(i, i + loopIncrement);
            }

            const cardPromise = fetch(`https://api.scryfall.com/cards/collection`, {
                headers: {
                'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(data),
            }).then((response) => response.json())
            .then(({ data, not_found = [] }) => {
                data.forEach(({ name, image_uris, card_faces }) => {
                    if (card_faces) {
                        // Some cards like Far // Away have card_faces but only one side so single image_uris
                        const { quantity } = cards.find(aCard => aCard.name === name || card_faces.find(cardFace => cardFace.name === aCard.name));
                        if (image_uris) {
                            dispatch(addCardImages({quantity, img: image_uris.large}));
                        } else {
                            card_faces.forEach(({ image_uris: { large }}) => dispatch(addCardImages({quantity, img: large}))); 
                        }
                    } else if (image_uris) {
                        const { quantity } = cards.find(aCard => aCard.name === name);
                        dispatch(addCardImages({quantity, img: image_uris.large}));
                    }

                    return data;
                });

                not_found.forEach(({ name }) => {
                    setFailedCardSearches(prevFailedCardSearches => [...prevFailedCardSearches, name])
                });
            })
            .catch(e => console.error(e));
            cardPromises.push(cardPromise);
        };

        setIsFetching(true);
        await Promise.allSettled(cardPromises);
        setIsFetching(false);
    }, [dispatch, setFailedCardSearches]);

    const uploadCollection = useCallback(async (file) => {
        const text = await file.text();
        const cards = text.split('\n').reduce((acc, t) => {
            if (t.length > 1 && t[0] !== '/') {
                const cardParts = t.split(' ');
                const subStringStartIndex = cardParts[0].length + 1;
                const quantity = Number.parseInt(cardParts[0]);
                cardParts.splice(0, 1);
                const card = {
                    quantity,
                    name: t.substring(subStringStartIndex).trim(),
                }
                return [...acc, card];
            }

            return acc;
        },[]);

        dispatch({type: RESET_CARD_IMAGES});
        getCardCollectionData(cards);
    }, [dispatch, getCardCollectionData]);

    let history = useHistory();

    const handleProxyButtonClock = useCallback(() => {
        history.push("/proxy");
    }, [history]);

    const handleFileInputOnChange = useCallback((e) => {
        const file = e.target.files[0];

        uploadCollection(file);
    }, [uploadCollection]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const fileInput = document.getElementById('deckFile');
        const { files } = e.dataTransfer
        const isTxtFile = files[0].type === 'text/plain';

        if (files.length > 1 || !isTxtFile) {
            return;
        }

        fileInput.files = e.dataTransfer.files;
        uploadCollection(e.dataTransfer.files[0]);
    }, [uploadCollection]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <>
            <Header siteTitle="MTG Proxy" />
            <StyledMain>
                <FileDropZone onDrop={handleDrop} onDragOver={handleDragOver}>
                <h2>Choose a file to upload or drag and drop a file here</h2>
                <FileInput 
                    id="deckFile" 
                    type="file"
                    accept=".txt"
                    onChange={handleFileInputOnChange} 
                    disabled={isFetching} 
                />
                {
                    isFetching ? <h2>Searching for Cards...</h2> : null
                }
                </FileDropZone>
                {
                    isFetching || cardImages.length <= 0 ? null : (
                        <Button type="button" onClick={handleProxyButtonClock}>
                            Proxy Deck
                        </Button>
                    )
                }
                {
                    isFetching || failedCardSearches.length <= 0 ? null :
                    (
                        <div>
                        <h2>Failed to find the following cards</h2>
                        {
                            failedCardSearches.map((failedCardName) => <h3 key={failedCardName}>{failedCardName}</h3>)
                        }
                        </div>
                    )
                }
            </StyledMain>
        </>
    );
}

export default Home;