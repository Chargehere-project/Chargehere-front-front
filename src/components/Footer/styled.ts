import styled from 'styled-components';

const FooterStyled = styled.div`


.footer {
    color: #333;
    padding: 20px;
    width: 100%;
    margin: 20px auto;
    max-width: 95%;
    /* border-top: 1px solid #ddd; */
}

.linkContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    flex-wrap: wrap; /* 추가: 공간이 부족할 때 줄바꿈 허용 */
    gap: 15px; /* 추가: 요소들 사이의 간격 설정 */
    border-top: 1px solid #ddd;
    padding-top: 20px;
}

.links {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.link {
    color: black;
    text-decoration: none;
    padding: 10px;
    font-size: 14px;
    white-space: nowrap;
}

.link:hover {
    text-decoration: underline;
}

.socialIcons {
    display: flex;
    gap: 15px;
}

.icon {
    font-size: 18px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.icon:hover {
    opacity: 0.7;
}

.infoContainer {
    line-height: 1.3;
    font-size: 12px;
    color: black;
    padding: 20px 10px;
    border-top: 1px solid #ddd;
}

.infoContainer p {
    margin: 8px 0;
}

.socialIcons {
    display: flex;
    gap: 15px;
}

.icon {
    cursor: pointer;
    transition: opacity 0.2s;
}

.icon:hover {
    opacity: 0.7;
}

/* 태블릿 (1024px 이하) */
@media screen and (max-width: 1024px) {
    .footer {
        padding: 15px;
        margin: 15px auto;
    }

    .link {
        padding: 8px;
        font-size: 13px;
    }

    .linkContainer {
        gap: 20px; /* 간격 늘림 */
        padding: 0 10px; /* 좌우 패딩 추가 */
    }

    .socialIcons {
        margin-left: auto; /* 소셜 아이콘을 오른쪽으로 정렬 */
        padding-right: 10px; /* 오른쪽 여백 추가 */
    }
}

/* 작은 태블릿 (768px 이하) */
@media screen and (max-width: 768px) {
    .linkContainer {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .links {
        flex-wrap: wrap;
        gap: 10px;
    }

    .link {
        padding: 5px;
        font-size: 12px;
    }

    .socialIcons {
        align-self: flex-start;
    }

    .infoContainer {
        font-size: 11px;
        padding: 15px 5px;
    }
}

/* 모바일 (480px 이하) */
@media screen and (max-width: 480px) {
    .footer {
        padding: 10px;
        margin: 10px auto;
    }

    .linkContainer {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
    }

    .links {
        display: grid; /* flex에서 grid로 변경 */
        grid-template-columns: repeat(2, auto); /* 2줄로 나누기 */
        grid-template-areas: 
            "privacy terms"
            "notice faqs"; /* 영역 이름 지정 */
        gap: 10px;
        width: 100%;
    }

    .link {
        padding: 3px;
        font-size: 11px;
    }

    .link[href="/laws/privacy"] { grid-area: privacy; }
    .link[href="/laws/terms"] { grid-area: terms; }
    .link[href="/notice"] { grid-area: notice; }
    .link[href="/faqs"] { 
        grid-area: faqs;
        margin-right: auto; /* FAQs와 소셜 아이콘 사이 간격 조정 */
    }

    .socialIcons {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: -25px; /* NOTICE/FAQS 줄과 같은 높이로 조정 */
        margin-left: auto; /* 오른쪽 정렬 */
    }

    .infoContainer {
        font-size: 10px;
        line-height: 1.4;
        margin-top: 15px; /* 상단 여백 추가 */
    }

    .infoContainer p {
        margin: 5px 0;
        word-break: break-word;
    }
}

`;

export default FooterStyled;