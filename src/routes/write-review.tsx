import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Title = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
const StarContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
`;
const StarWrapper = styled.div``;
const Star = styled.label<{ selected: boolean }>`
  font-size: 40px;
  color: ${(props) => (props.selected ? "#FFD700" : "#DDDDDD")};
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  position: relative;
  width: 20px;

  &::before {
    content: "★";
    position: absolute;
    left: 0;
    overflow: hidden;
    color: ${(props) => (props.selected ? "#FFD700" : "#DDDDDD")};
  }

  &:hover,
  &:hover ~ label {
    color: #ffd700;
  }
`;
const HiddenRadio = styled.input`
  display: none;
`;
const Error = styled.span`
  font-weight: 600;
  color: tomato;
  text-align: center;
  display: block;
`;

export default function WriteReview() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const FILE_SIZE_LIMIT = 1 * 1024 * 1024;

  const onTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };
  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > FILE_SIZE_LIMIT) {
        // 파일 크기 제한
        alert("파일 크기가 너무 큽니다!\n1MB 이하의 파일로 업로드해주세요!");
        return;
      }
      setPhoto(files[0]);
    }
  };
  const handleStarClick = (value: number) => {
    setRating(value);
  };
  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };
  const handleMouseLeave = () => {
    setHoverRating(null);
  };
  const getStarRating = () => {
    return hoverRating !== null ? hoverRating : rating;
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const user = auth.currentUser;
    if (!user || content === "") return;
    if (title === "") {
      setError("제목을 입력해주세요!");
      return;
    }
    if (!rating) {
      setError("별점을 주세요!");
      return;
    }
    try {
      setIsLoading(true);
      const docRef = doc(collection(db, "reviews"));
      const docId = docRef.id;
      await setDoc(docRef, {
        reviewId: docId,
        userId: user.uid,
        username: user.displayName || "Anonymous",
        title,
        content,
        rating,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      if (photo) {
        const photoLocationRef = ref(
          storage,
          `users/${user.uid}/reviews/${docId}`
        );
        const photoResult = await uploadBytes(photoLocationRef, photo);
        const photoUrl = await getDownloadURL(photoResult.ref);
        await updateDoc(docRef, {
          photo: photoUrl,
        });
      }
      navigate("/review-board");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Title
        onChange={onTitleChange}
        value={title}
        placeholder="제목을 입력해주세요!"
        rows={1}
        maxLength={30}
      />
      <TextArea
        onChange={onContentChange}
        value={content}
        placeholder="리뷰를 작성해주세요!"
      />
      <>별점을 주세요!</>
      <StarContainer>
        {[5, 4, 3, 2, 1].map((value) => (
          <StarWrapper key={value}>
            <HiddenRadio
              type="radio"
              id={`star${value}`}
              name="rating"
              value={value}
              onChange={() => handleStarClick(value)}
            />
            <Star
              htmlFor={`star${value}`}
              selected={value <= (getStarRating() || 0)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleStarClick(value)}
            >
              ★
            </Star>
          </StarWrapper>
        ))}
      </StarContainer>
      <AttachFileButton htmlFor="file">
        {photo ? "사진이 등록되었습니다" : "사진을 추가해주세요!"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "업로드 중..." : "업로드하기"}
      />
      {error !== "" ? <Error>{error}</Error> : null}
    </Form>
  );
}
