import styled from 'styled-components';

export const SortContainer = styled.div`
    position: relative;
    display: inline-block;
`;

export const SortButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #333;

    svg {
        transition: transform 0.3s ease;
    }

    &.active svg {
        transform: rotate(180deg);
    }
`;

export const DropdownMenu = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 0;
    width: 150px;
    display: ${props => props.isOpen ? 'block' : 'none'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 10;
`;

export const MenuItem = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
    color: #333;

    &:hover {
        background: #f5f5f5;
    }

    &.active {
        font-weight: bold;
        background: #f0f0f0;
    }
`;