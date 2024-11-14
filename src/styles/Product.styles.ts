import styled from 'styled-components';

export const ProductContainer = styled.div`
    width: 90%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 0;
`;

export const ProductTitle = styled.h1`
    font-size: 36px;
    font-weight: bold;
    color: #555;
    padding: 20px 0;
    text-align: left;
`;

export const TopContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px 0;
    margin-bottom: 20px;
    gap: 12px;

    @media screen and (max-width: 768px) {
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 16px;
    }
`;

export const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const SearchIconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    color: black;
`;

export const SearchInput = styled.input<{ isVisible: boolean }>`
    width: 200px;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-right: 8px;
    opacity: ${props => props.isVisible ? 1 : 0};
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
    transform: ${props => props.isVisible ? 'translateX(0)' : 'translateX(20px)'};
    transition: all 0.3s ease;

    @media screen and (max-width: 768px) {
        width: 180px;
    }

    @media screen and (max-width: 480px) {
        width: ${props => props.isVisible ? '100%' : '0'};
        margin-right: ${props => props.isVisible ? '8px' : '0'};
        padding: ${props => props.isVisible ? '8px 12px' : '0'};
        transform: none;
    }
`;

export const ProductGrid = styled.div`
    /* max-width: 1400px; */
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin: 0 auto;

    @media screen and (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    @media screen and (max-width: 480px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;
