import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { FirebaseError } from "firebase/app";
import LoadingScreen from "../components/loading-screen";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export interface Review {
  reviewId: number;
  userId: string;
  username: string;
  title: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  photo?: string;
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewBox = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ReviewTitle = styled.h2`
  color: black;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const ReviewContent = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #333;
`;

const ReviewAuthor = styled.span`
  font-size: 16px;
  color: #666;
  display: block;
  margin-top: 10px;
`;

const ReviewDate = styled.span`
  font-size: 14px;
  color: #999;
  display: block;
  margin-top: 5px;
`;

const WriteButton = styled.div`
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

const Error = styled.span`
  font-weight: 600;
  color: tomato;
  text-align: center;
  display: block;
`;

export default function ReviewBoard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc")
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
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);
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
  const onWriteButtonClick = () => {
    navigate("/write-review");
  };
  const onClick = (review: Review) => {
    navigate(`/review/${review.reviewId}`, { state: { review } });
  };
  return (
    <Wrapper>
      <Title>리뷰 게시판</Title>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ReviewList>
          {reviews.map((review) => (
            <ReviewBox onClick={() => onClick(review)} key={review.reviewId}>
              <ReviewTitle>{review.title}</ReviewTitle>
              <ReviewContent>{review.content}</ReviewContent>
              <ReviewAuthor>By: {review.username || "Anonymous"}</ReviewAuthor>
              <ReviewDate>{timestampToDate(review.createdAt)}</ReviewDate>
            </ReviewBox>
          ))}
        </ReviewList>
      )}
      <WriteButton onClick={onWriteButtonClick}>리뷰 쓰기</WriteButton>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
