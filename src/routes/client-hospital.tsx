import { useNavigate } from "react-router-dom";
import { Wrapper } from "../components/auth-components";
import styled from "styled-components";

const Background = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Button = styled.div`
  width: 200px;
  height: 200px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 1000;
  cursor: pointer;
  margin: 10px;
`;

const Row = styled.span`
  display: flex;
  flex-direction: row;
`;

export default function ClientHospital() {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/create-account");
  };
  return (
    <Background>
      <Wrapper>
        <Row>
          <Button onClick={onClick}>환자</Button>
          <Button onClick={onClick}>병원</Button>
        </Row>
      </Wrapper>
    </Background>
  );
}
