import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";

export interface myProfile {
  desiredTreatment: string;
  createdAt: number;
  userId: string;
  username: string;
  xray?: string;
  ct?: string;
}

const Wrapper = styled.div``;

const Username = styled.span``;

const Quote = styled.div``;

const Xray = styled.div``;

const CT = styled.div``;

const Desire = styled.span``;

function extract({
  username,
  xray,
  ct,
  desiredTreatment,
  createdAt,
}: myProfile) {
  return (
    <Wrapper>
      <Username>{username}님의 마이페이지입니다.</Username>
      <Quote>{username}님이 보낸 견적서 목록</Quote>
      {xray ? (
        <Xray>
          Xray 사진
          <img src={xray} />
        </Xray>
      ) : null}
      {ct ? (
        <CT>
          CT 사진
          <img src={ct} />
        </CT>
      ) : null}
      <Desire>
        {username}님이 요청하신 치료
        <br />
        {desiredTreatment}
      </Desire>
      <h1>{createdAt}에 생성됨</h1>
    </Wrapper>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<myProfile[]>([]);
  const fetchProfile = async () => {
    const profileQuery = query(
      collection(db, "quotes"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(profileQuery);
    const profile = snapshot.docs.map((doc) => {
      const { desiredTreatment, createdAt, userId, username, xray, ct } =
        doc.data();
      return {
        desiredTreatment,
        createdAt,
        userId,
        username,
        xray,
        ct,
        id: doc.id,
      };
    });
    setProfile(profile);
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return <Wrapper>{profile.map(extract)}</Wrapper>;
}
