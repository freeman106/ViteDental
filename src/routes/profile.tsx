import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div``;

const Title = styled.span`
  display: flex;
  text-align: center;
  width: 100%;
  font-size: 50px;
  margin: 20px;
  font-weight: 1000;
`;

const GoToRequests = styled.div`
  display: inline-block;
  background-color: white;
  color: black;
  border-radius: 20px;
  margin: 10px;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
`;

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const onRequestClick = () => {
    navigate("/my-requests");
  };
  return (
    <Wrapper>
      <Title>{user?.displayName}님의 마이페이지</Title>
      <GoToRequests onClick={onRequestClick}>내가 보낸 요청</GoToRequests>
    </Wrapper>
  );
}
