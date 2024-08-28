import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Wrapper } from "../components/auth-components";

const Box = styled.div`
  background-color: white;
  padding: 10px 20px;
  width: 200%;
  height: 100%;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 1000;
  margin-bottom: 10px;
  color: black;
`;

const Name = styled.h1`
  font-size: 35px;
  font-weight: 800;
  margin-bottom: 8px;
  color: black;
`;
const Time = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: black;
  margin-bottom: 8px;
`;

const Content = styled.h1`
  font-size: 20px;
  color: black;
`;

export default function ReviewDetail() {
  const location = useLocation();
  const timestampToDate = (date: Date) => {
    const year = date.getFullYear().toString().slice(-2); //년도 뒤에 두자리
    const month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
    const day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
    const hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    const minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
    const second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)

    const returnDate =
      year + "." + month + "." + day + " " + hour + ":" + minute + ":" + second;
    return returnDate;
  };
  return (
    <Wrapper>
      <Box>
        <Title>{location.state.review.title}</Title>
        <Name>{location.state.review.username}</Name>
        <Time>{timestampToDate(location.state.review.createdAt)}</Time>
        <hr />
        <Content>{location.state.review.content}</Content>
      </Box>
    </Wrapper>
  );
}
