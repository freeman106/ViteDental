import styled from "styled-components";
import { auth } from "../firebase";

const Background = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div``;

const Title = styled.span`
  display: flex;
  text-align: center;
  width: 100%;
  height: 9%;
  font-size: 50px;
  margin: 20px;
  font-weight: 1000;
  color: #81dd75;
`;

const Button = styled.span`
  color: white;
  font-size: 30px;
  font-weight: 800;
  background-color: #81dd75;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  margin: 10px;
`;

const ButtonRow = styled.span`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export default function ProfileHospital() {
  const user = auth.currentUser;
  return (
    <Background>
      <Wrapper>
        <Title>{user?.displayName}님의 마이페이지</Title>
        <ButtonRow>
          <Button>병원 정보</Button>
          <Button>구독 현황</Button>
        </ButtonRow>
        <ButtonRow>
          <Button>견적</Button>
          <Button>채팅</Button>
          <Button>광고</Button>
        </ButtonRow>
      </Wrapper>
    </Background>
  );
}
