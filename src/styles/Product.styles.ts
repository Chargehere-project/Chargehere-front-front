import styled from 'styled-components';

export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 0 20px;
    max-width: 1400px;
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
        padding: 0 16px;
    }
`;

export const TopContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    gap: 12px;

    @media screen and (max-width: 768px) {
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 16px;
    }

    @media screen and (max-width: 480px) {
        padding: 16px;
        align-items: stretch;
    }
`;

export const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    
    @media screen and (max-width: 480px) {
        width: 100%;
        justify-content: flex-end;
    }
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
    position: absolute;
    right: 100%;
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
        position: static;
        width: ${props => props.isVisible ? '100%' : '0'};
        margin-right: ${props => props.isVisible ? '8px' : '0'};
        padding: ${props => props.isVisible ? '8px 12px' : '0'};
        transform: none;
    }
`;
export const ProductTitle = styled.h1`
    font-size: 28px;
    padding: 10px 0;
    margin: 0;
    margin-top: 0;
`;