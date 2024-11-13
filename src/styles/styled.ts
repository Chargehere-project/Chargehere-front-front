import styled from 'styled-components';

const HomeStyled = styled.div`

.mainBanner {
  background-image: url('/intro.jpg');
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.bannerContent {
  text-align: center;
  color: white;
}

.fadeIn {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeIn 2s forwards;
}

.fadeInButton {
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  opacity: 0;
  animation: fadeInButton 2.5s forwards;
  margin-top: 10px;
  margin-right: 20px;
}

.fadeInButton:hover {
  background-color: #0056B3;
}

.fadeInSection {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}

.secondSection, .thirdSection, .fourthSection, .fifthSection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
}

.textContainer {
  width: 50%;
  text-align: center;
}

.textContainer h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

.textContainer p {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
}

.imageContainer {
  width: 50%;
  display: flex;
  justify-content: center;
}

.image {
  max-width: 80%;
  height: auto;
  border-radius: 10px;
}

.thirdSection, .fifthSection {
  flex-direction: row-reverse;
}

.sixthSection {
  background-color: #F4F4F4;
  padding: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.sixthText h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #00AAFF;
}

.sixthText p {
  font-size: 1.5rem;
  color: #666;
}

.sixthText a {
  color: #00AAFF;
  text-decoration: none;
}

.sixthText a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInButton {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 태블릿 디바이스 (1024px 이하) */
@media screen and (max-width: 1024px) {
  .fadeIn {
    font-size: 2.5rem;
  }

  .fadeInButton {
    padding: 12px 25px;
    font-size: 1.1rem;
  }

  .textContainer h2 {
    font-size: 1.8rem;
  }

  .textContainer p {
    font-size: 1.1rem;
  }

  .sixthSection {
    padding: 70px;
  }

  .sixthText h1 {
    font-size: 2.2rem;
  }

  .sixthText p {
    font-size: 1.3rem;
  }
}

/* 태블릿 디바이스 (768px 이하) */
@media screen and (max-width: 768px) {
  .fadeIn {
    font-size: 2rem;
  }

  .fadeInButton {
    padding: 10px 20px;
    font-size: 1rem;
    margin-right: 10px;
  }

  .secondSection, .thirdSection, .fourthSection, .fifthSection {
    flex-direction: column;
    padding: 30px;
  }

  .thirdSection, .fifthSection {
    flex-direction: column;  /* row-reverse 제거 */
  }

  .textContainer, .imageContainer {
    width: 100%;
    margin-bottom: 30px;
  }

  .image {
    max-width: 90%;
  }

  .sixthSection {
    padding: 50px 30px;
  }

  .sixthText h1 {
    font-size: 2rem;
  }

  .sixthText p {
    font-size: 1.2rem;
  }
}

/* 모바일 디바이스 (480px 이하) */
@media screen and (max-width: 480px) {
  .fadeIn {
    font-size: 1.7rem;
  }

  .fadeInButton {
    padding: 10px 15px;
    font-size: 0.9rem;
    margin: 5px 0;
    width: 80%;  /* 버튼 너비 확장 */
    margin-right: 0;
  }

  .bannerContent {
    padding: 0 20px;  /* 좌우 여백 추가 */
  }

  .textContainer h2 {
    font-size: 1.5rem;
  }

  .textContainer p {
    font-size: 1rem;
  }

  .secondSection, .thirdSection, .fourthSection, .fifthSection {
    padding: 20px;
  }

  .image {
    max-width: 100%;
  }

  .sixthSection {
    padding: 40px 20px;
  }

  .sixthText h1 {
    font-size: 1.7rem;
  }

  .sixthText p {
    font-size: 1.1rem;
  }
}

`;

export default HomeStyled;
