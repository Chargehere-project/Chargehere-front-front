import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
`;

export const Sidebar = styled.div`
    width: 30%;
    overflow-y: scroll;
    padding: 30px;
    border-right: 1px solid #ccc;
`;

export const MapContainer = styled.div`
    width: 70%;
    height: 100%;
    border-left: 1px solid #ccc;
    border-radius: 8px;
`;

export const Heading = styled.h3`
    font-size: 24px;
    margin-bottom: 20px;
`;

export const ChargerList = styled.ul`
    list-style: none;
    padding: 0;
`;

export const ChargerItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
`;

export const ChargerInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ChargerName = styled.strong`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

export const ChargerAddress = styled.p`
    margin: 5px 0 0;
    color: #666;
    font-size: 14px;
    margin-top: 10px;
`;

export const LocationButton = styled.button`
    padding: 8px 12px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #888;
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

export const SearchInput = styled.input`
    flex: 1;
    padding: 8px;
    border-radius: 5px;
`;

export const MyLocationButton = styled.button`
    padding: 8px;
    margin-left: 10px;
    background-color: black;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: #888 !important;
    }
`;
// MapComponentStyles.ts에 추가
export const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
    z-index: 100;
`;

export const SearchResultsContainer = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const SearchResultItem = styled.div`
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    background: white;

    &:hover {
        background-color: #f5f5f5;
    }

    .place-name {
        font-weight: bold;
        margin-bottom: 4px;
    }

    .address {
        font-size: 0.9em;
        color: #666;
    }

    &:last-child {
        border-bottom: none;
    }
`;