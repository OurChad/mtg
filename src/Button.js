
import styled from 'styled-components';

const Button = styled.button`
    background-color: #A2C3A4;
    border: 1px solid #333;
    border-radius: 4px;
    color: #FFF;
    cursor: pointer;
    display: inline-block;
    font-family: inherit;
    font-size: 1.2rem;
    margin: 0;
    padding: 0.5rem;
    text-decoration: none;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    &:hover {
        background-color: #5B616A;
    }
`;

export default Button;