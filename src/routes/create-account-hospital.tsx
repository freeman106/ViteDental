import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GoogleButton from "../components/google-btn";
import styled from "styled-components";

// const errors = {
//   "auth/email-already-in-use" : "이미 존재하는 이메일입니다."
// }

const Background = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const AttachFileButton0 = styled.label`
  padding: 10px 20px;
  margin: 10px;
  background-color: black;
  color: white;
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

export default function CreateAccountHospital() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Background>
      <Wrapper>
        <Title>회원가입 하세요!</Title>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="병원이름"
            type="text"
            required
          />
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="대표자이름"
            type="text"
            required
          />
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="전화번호"
            type="text"
            required
          />
          <Input
            onChange={onChange}
            name="email"
            value={email}
            placeholder="이메일"
            type="email"
            required
          />
          <Input
            onChange={onChange}
            name="password"
            value={password}
            placeholder="비밀번호"
            type="password"
            required
          />
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="지역"
            type="text"
            required
          />
          <AttachFileButton0 htmlFor="xray">
            면허증이나 사업자등록증 사진
          </AttachFileButton0>
          <AttachFileInput
            onChange={() => {
              console.log("파일처리");
            }}
            type="file"
            id="xray"
            accept="image/*"
          />

          <Input type="submit" value={isLoading ? "로딩중..." : "회원가입"} />
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>
          계정이 있으신가요? <Link to="/login">바로 로그인하세요!</Link>
        </Switcher>
        <GoogleButton />
      </Wrapper>
    </Background>
  );
}
