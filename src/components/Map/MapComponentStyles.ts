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