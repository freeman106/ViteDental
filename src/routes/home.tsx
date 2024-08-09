import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  Box,
  Button,
  ReviewButton,
  Wrapper,
} from "../components/auth-components";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 60px;
  font-weight: 1000;
  margin-bottom: 20px;
`;

const SubTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 20px;
`;

export default function Home() {
  const navigate = useNavigate();
  const logOut = async () => {
    await auth.signOut();
    window.location.reload();
  };

  const logIn = () => {
    navigate("/login");
  };

  const signIn = () => {
    navigate("/create-account");
  };

  const profile = () => {
    navigate("/profile");
  };

  const quotation = () => {
    navigate("/quotation");
  };

  interface Review {
    id: string;
    user: string;
    review: string;
    details: string;
  }

  const reviews = [
    {
      id: "1",
      user: "User1",
      review: "너무 친절하고 좋았어요!",
      details: "치료과정도 상세히 설명해주셨고, 모든 스텝분들이 친절했습니다.",
    },
    {
      id: "2",
      user: "User2",
      review: "치료 결과에 매우 만족합니다.",
      details: "치료 후에 경과도 좋고, 재방문 의사가 있습니다.",
    },
    {
      id: "3",
      user: "User3",
      review: "가격도 적당하고 시설도 깨끗해요.",
      details: "시설이 매우 깨끗하고 청결합니다. 가격도 합리적입니다.",
    },
  ];

  const renderItem = (item: Review) => (
    <ReviewButton
      key={item.id}
      onClick={() => console.log("Go to ReviewDetails", { review: item })}
    >
      <p>{item.user}</p>
      <p>{item.review}</p>
    </ReviewButton>
  );

  return (
    <Wrapper>
      <Title>당신의치과</Title>
      <Button onClick={quotation}>견적서 작성하기</Button>

      <SubTitle>이용 후기</SubTitle>
      <Button onClick={() => console.log("Go to ReviewBoard")}>전체보기</Button>

      <Box>{reviews.map(renderItem)}</Box>

      {auth.currentUser !== null ? (
        <>
          <Button onClick={profile}>마이페이지</Button>
          <Button onClick={logOut}>로그아웃</Button>
        </>
      ) : (
        <>
          <Button onClick={logIn}>로그인</Button>
          <Button onClick={signIn}>회원가입</Button>
        </>
      )}
    </Wrapper>
  );
}
