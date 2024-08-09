import { useState } from "react";
import { Button, Title } from "../components/auth-components";
import styled from "styled-components";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AttachFileButton0 = styled.label`
  padding: 10px 20px;
  margin: 10px;
  background-color: white;
  color: black;
  text-align: center;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
`;

const AttachFileButton1 = styled.label`
  padding: 10px 20px;
  margin: 10px;
  background-color: #7adf7a;
  color: black;
  text-align: center;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
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

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  width: 100%;
  margin: 10px;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
  text-align: center;
  display: block;
`;

export default function Quotation() {
  const navigate = useNavigate();
  const FILE_SIZE_LIMIT = 1 * 1024 * 1024;
  const [desiredTreatment, setDesiredTreatment] = useState("");
  const [xrayFile, setXrayFile] = useState<File | null>(null);
  const [ctFile, setCtFile] = useState<File | null>(null);
  const [isDesiredTreatmentClicked, setIsDesiredTreatmentClicked] =
    useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const onDesiredTreatmentClicked = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (isDesiredTreatmentClicked) {
      setIsDesiredTreatmentClicked(false);
    } else setIsDesiredTreatmentClicked(true);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesiredTreatment(e.target.value);
  };
  const onXrayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 사진을 하나만 받음
      if (files[0].size > FILE_SIZE_LIMIT) {
        // 파일 크기 제한
        alert("파일 크기가 너무 큽니다!\n1MB 이하의 파일로 업로드해주세요!");
        return;
      }
      setXrayFile(files[0]);
    }
  };
  const onCtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 사진을 하나만 받음
      if (files[0].size > FILE_SIZE_LIMIT) {
        // 파일 크기 제한
        alert("파일 크기가 너무 큽니다!\n1MB 이하의 파일로 업로드해주세요!");
        return;
      }
      setCtFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const user = auth.currentUser;
    if (!user) {
      setError("로그인을 해주세요!");
      return;
    } else if (uploading) {
      setError("업로드 중입니다...");
      return;
    } else if (!(xrayFile || ctFile)) {
      setError("사진을 업로드해주세요!");
      return;
    }
    try {
      setUploading(true);
      const doc = await addDoc(collection(db, `users/${user.uid}/quotes`), {
        desiredTreatment,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (xrayFile) {
        const xrayLocationRef = ref(
          storage,
          `users/${user.uid}/xray/${doc.id}`
        );
        const xrayResult = await uploadBytes(xrayLocationRef, xrayFile);
        const xrayUrl = await getDownloadURL(xrayResult.ref);
        await updateDoc(doc, {
          xray: xrayUrl,
        });
      }
      if (ctFile) {
        const ctLocationRef = ref(storage, `users/${user.uid}/ct/${doc.id}`);
        const ctResult = await uploadBytes(ctLocationRef, ctFile);
        const ctUrl = await getDownloadURL(ctResult.ref);
        await updateDoc(doc, {
          ct: ctUrl,
        });
      }
      setDesiredTreatment("");
      setXrayFile(null);
      setCtFile(null);
      navigate("/my-requests");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setUploading(false);
    }
  };
  return (
    <Wrapper>
      <Title>당신의 치아를 보여주세요!</Title>
      <Form onSubmit={onSubmit}>
        {xrayFile ? (
          <AttachFileButton1 htmlFor="xray">
            파노라마 X-ray가 등록되었습니다!
          </AttachFileButton1>
        ) : (
          <AttachFileButton0 htmlFor="xray">
            나의 파노라마 X-ray 올리기
          </AttachFileButton0>
        )}
        <AttachFileInput
          onChange={onXrayFileChange}
          type="file"
          id="xray"
          accept="image/*"
        />
        {ctFile ? (
          <AttachFileButton1 htmlFor="ct">
            CT X-ray가 등록되었습니다!
          </AttachFileButton1>
        ) : (
          <AttachFileButton0 htmlFor="ct">
            나의 CT X-ray 올리기
          </AttachFileButton0>
        )}
        <AttachFileInput
          onChange={onCtFileChange}
          type="file"
          id="ct"
          accept="image/*"
        />
        <Button onClick={onDesiredTreatmentClicked}>
          원하는 치료 입력하기
        </Button>
        {isDesiredTreatmentClicked ? (
          <TextArea
            onChange={onChange}
            value={desiredTreatment}
            placeholder="원하는 치료를 입력해주세요"
          />
        ) : null}
        <SubmitBtn
          type="submit"
          value={uploading ? "업로드 중..." : "견적 받기"}
        />
        {error !== "" ? <Error>{error}</Error> : null}
      </Form>
    </Wrapper>
  );
}
