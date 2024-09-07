import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { Box, Button, Wrapper } from "../components/auth-components";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { Review } from "./review-board";

const Background = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 1000;
  margin-bottom: 20px;
  color: black;
`;

const ReviewButton = styled.div`
  border-radius: 20px;
  font-size: 20px;
  background-color: white;
  width: 100%;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  color: black;
  background-color: #c7c7c7;
`;

const SubTitle = styled.h1`
  font-size: 44px;
  font-weight: 800;
  margin: 20px;
  color: black;
`;

const Loading = styled.span`
  font-size: 24px;
`;

const ReviewRow = styled.span`
  display: flex;
  flex-direction: row;
`;

const ReviewName = styled.h2`
  font-size: 30px;
  font-weight: 1000;
`;

const ReviewRating = styled.span`
  font-size: 25px;
  margin-left: auto;
  margin-right: 10px;
`;

const ReviewContent = styled.span`
  font-size: 22px;
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
  text-align: center;
  display: block;
`;

export default function Home() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        limit(4)
      );
      const snapshot = await getDocs(reviewsQuery);
      const reviewsData = snapshot.docs.map((doc) => {
        const {
          userId,
          username,
          title,
          rating,
          content,
          createdAt,
          updatedAt,
          reviewId,
          photo,
        } = doc.data();
        return {
          id: doc.id,
          userId,
          username,
          title,
          rating,
          content,
          updatedAt: new Date(updatedAt),
          createdAt: new Date(createdAt),
          reviewId,
          photo,
        };
      });
      setReviews(reviewsData);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
        console.log(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const logOut = async () => {
    await auth.signOut();
    window.location.reload();
  };

  const logIn = () => {
    navigate("/login");
  };

  const signIn = () => {
    navigate("/client-hospital");
  };

  const profile = () => {
    navigate("/profile");
  };

  const quotation = () => {
    navigate("/quotation");
  };

  const reviewBoard = () => {
    navigate("/review-board");
  };

  const findClinic = () => {
    console.log("GO to map API");
  };

  const renderItem = (review: Review) => (
    <ReviewButton
      key={review.reviewId}
      onClick={() =>
        navigate(`/review/${review.reviewId}`, { state: { review } })
      }
    >
      <ReviewRow>
        <ReviewName>{review.username}</ReviewName>
        <ReviewRating>별점:{review.rating}</ReviewRating>
      </ReviewRow>
      <ReviewContent>{review.title}</ReviewContent>
    </ReviewButton>
  );

  return (
    <Background>
      <Wrapper>
        <Title>당신의치과</Title>
        <Button onClick={quotation}>견적서 작성하기</Button>

        <SubTitle>이용 후기</SubTitle>
        <Button onClick={reviewBoard}>전체보기</Button>

        {isLoading ? <Loading></Loading> : <Box>{reviews.map(renderItem)}</Box>}
        {error !== "" ? <Error>{error}</Error> : null}

        <Button onClick={findClinic}>내 주변 치과 찾기</Button>

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
    </Background>
  );
}
