import styled from "styled-components";
import { Wrapper } from "../components/auth-components";
import { useNavigate } from "react-router-dom";

const Background = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Title = styled.span`
  width: 100%;
  font-size: 40px;
  color: green;
  font-weight: 1000;
`;

const Hospital = styled.span`
  font-size: 30px;
  color: green;
`;

const Profile = styled.div`
  font-size: 20px;
  color: white;
  margin: 30px;
  padding: 15px;
  background-color: black;
  border-radius: 15px;
  cursor: pointer;
`;

const RequestBox = styled.div`
  width: 100%;
  height: 50%;
  border-radius: 15px;
  background-color: #c7c7c7;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RequestRow = styled.span`
  width: 100%;
  margin: 10px;
  background-color: white;
  font-size: 20px;
  color: black;
  cursor: pointer;
`;

const Bar = styled.span`
  width: 100%;
  color: black;
`;

export default function HomeHospital() {
  const navigate = useNavigate();
  const onProfileClick = () => {
    navigate("/profile-hospital");
  };
  return (
    <Background>
      <Wrapper>
        <Title>당신의 치과</Title>
        <Hospital>for hospital</Hospital>
        <Profile onClick={onProfileClick}>프로필</Profile>
        <RequestBox>
          <RequestRow>정원호 / 67세 / 송파 / 임플란트</RequestRow>
          <RequestRow>정원호 / 67세 / 신촌 / 교정</RequestRow>
          <RequestRow>정원호 / 67세 / 신촌 / 교정</RequestRow>
          <RequestRow>정원호 / 67세 / 신촌 / 교정</RequestRow>
          <RequestRow>정원호 / 67세 / 신촌 / 교정</RequestRow>
          <RequestRow>정원호 / 67세 / 신촌 / 교정</RequestRow>
        </RequestBox>
        <Bar>홈 | 받은 요청 | 구독 | 채팅</Bar>
      </Wrapper>
    </Background>
  );
}
