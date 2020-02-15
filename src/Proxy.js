import React from 'react';
import { useStore } from './state/StoreContext';
import styled from 'styled-components';

const Card = styled.div`
  position: relative;
  padding: 0 5px 0 5px;
  /* border: 1px dotted #ccc; */
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
`;

const CardImage = styled.img`
  /* width: 252px;
  height: 344px; */
  width: 246px;
  height: 346px;
`;

function Proxy() {
    const [{ cardImages }] = useStore();
    return (
        cardImages.length > 0 ? (
            <div>
                {
                    cardImages.map(({quantity, img}) => {
                        const cardElements = [];
                        for(let i = 0; i < quantity; i++) {
                            cardElements.push(<Card key={`${img}_${i}`}><CardImage src={img} /></Card>)
                        }
                        return cardElements;
                    })
                }
            </div>
        ) : (
            <h2>No cards found. Best head back and try again.</h2>
        )
    )
}

export default Proxy;