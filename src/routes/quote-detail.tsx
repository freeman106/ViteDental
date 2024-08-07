import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Wrapper } from "../components/auth-components";

const Box = styled.div`
  background-color: white;
  padding: 10px 20px;
  width: 200%;
  height: 100%;
`;

const Hospital = styled.h1`
  font-size: 50px;
  font-weight: 1000;
  margin-bottom: 10px;
  color: black;
`;

const Fee = styled.h1`
  font-size: 35px;
  font-weight: 800;
  margin-bottom: 8px;
  color: black;
`;
const Title = styled.h1`
  font-size: 35px;
  font-weight: 800;
  color: black;
  margin-bottom: 8px;
`;

const Message = styled.h1`
  font-size: 20px;
  color: black;
`;

export default function QuoteDetail() {
  const location = useLocation();
  return (
    <Wrapper>
      <Box>
        <Hospital>{location.state.quote.hospital}</Hospital>
        <Fee>{location.state.quote.fee}</Fee>
        <Title>{location.state.quote.title}</Title>
        <hr />
        <Message>{location.state.quote.message}</Message>
      </Box>
    </Wrapper>
  );
}
