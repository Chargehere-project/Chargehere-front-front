import styled from 'styled-components';

const RwriteStyled = styled.div`

.reviewContainer {
    width: 60%;
    margin: 0 auto;
    padding: 20px;
    /* background-color: #f9f9f9; */
    border-radius: 10px;
    /* box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); */
    text-align: left;
    margin: 0 auto;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
}

.Title {
    font-size: 36px;
    font-weight: bold;
    color: #555;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
}

.reviewForm {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
}

.label {
    font-size: 16px;
    font-weight: bold;
    color: #444;
    margin-top: 50px;
    padding-top: 20px;
}

.ratingContainer {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
}

.starRating {
    display: flex;
    gap: 5px;
    cursor: pointer;
}

.star {
    font-size: 24px;
    color: #ccc;
    transition: color 0.2s;
}


.textarea {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
}

.fileInput {
    padding: 5px;
    font-size: 16px;
    /* border: 1px solid #ddd; */
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
}

.submitButton {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 25px; 
    cursor: pointer;
    margin-top: 20px;
    font-weight: bold;
    text-align: center;
}

.submitButton:hover {
    background-color: #333;
}


`;

export default RwriteStyled;