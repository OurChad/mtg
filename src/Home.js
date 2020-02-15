import React, { useState, useCallback } from 'react';
import { useStore } from './state/StoreContext';
import { setCardImages } from './state/StoreActions';
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
`;

function Home() {
    const [{ cardImages }, dispatch] = useStore();
    const [failedCardSearches, setFailedCardSearches] = useState([]);

    const getCardData = useCallback(async (cards) => {
        const cardPromises = cards.map(({ name, quantity }) => {

        return fetch(`https://api.scryfall.com/cards/named?exact=${name}`, {
            headers: {
            'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((resp) => {
                const { image_uris, card_faces } = resp;
                if (card_faces) {
                    card_faces.forEach(({ image_uris: { large }}) => dispatch(setCardImages({quantity, img: large})));

                    return resp;
                } else if (image_uris) {
                    dispatch(setCardImages({quantity, img: image_uris.large}))
                    // setCardImages(prevCardImage => [...prevCardImage, {quantity, img: image_uris.large}]);
                    return resp;
                }
                
                setFailedCardSearches(prevFailedCardSearches => [...prevFailedCardSearches, name]);
            })
            .catch(e => console.error(e));
        });

        await Promise.allSettled(cardPromises);
    }, [dispatch, setFailedCardSearches]);

    const upload = useCallback(async (file) => {
        const text = await file.text();
        const cards = text.split('\n').reduce((acc, t) => {
            if (t.length > 1 && t[0] !== '/') {
            const cardParts = t.split(' ');
            const quantity = Number.parseInt(cardParts[0]);
            cardParts.splice(0, 1);
            const card = {
                quantity,
                name: cardParts.reduce((acc, p) => acc ? `${acc}+${p}` : p, "")
            }
            return [...acc, card];
            }

            return acc;
        },[])
        console.table(cards);
        getCardData(cards);
    }, [getCardData]);

    let history = useHistory();

    const handleProxyButtonClock = useCallback(() => {
        history.push("/proxy");
    }, [history]);

    const handleFileInputOnChange = useCallback((e) => {
        const file = e.target.files[0];

        upload(file);
    }, [upload]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();

        upload(e.dataTransfer.files[0]);
    }, [upload]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <>
            <Header siteTitle="MTG Proxy" />
            <StyledMain>
                <FileDropZone onDrop={handleDrop} onDragOver={handleDragOver}>
                <h2>Choose a file to upload or drag and drop a file here</h2>
                <FileInput id="deckFile" type="file" onChange={handleFileInputOnChange}/>
                </FileDropZone>
                {
                    cardImages.length <= 0 ? null : (
                        <Button type="button" onClick={handleProxyButtonClock}>
                            Proxy Deck
                        </Button>
                    )
                }
                {
                    failedCardSearches.length <= 0 ? null :
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