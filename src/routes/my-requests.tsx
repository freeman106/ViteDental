import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import LoadingScreen from "../components/loading-screen";
import { Switcher } from "../components/auth-components";

export interface MyRequest {
  desiredTreatment: string;
  createdAt: number;
  userId: string;
  username: string;
  xray?: string;
  ct?: string;
  id?: string;
}

const Wrapper = styled.div``;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 800;
  margin: 20px;
  padding: 20px 10px;
`;

const RequestList = styled.div`
  align-items: center;
`;

const RequestBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  border-radius: 20px;
  margin: 10px;
  padding: 10px 20px;
  width: 100%;
  cursor: pointer;
`;

const RequestID = styled.span`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
  margin-top: 8px;
`;

const RequestDate = styled.span`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const RequestContent = styled.span`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
  text-align: center;
  display: block;
`;

const NoRequest = styled.span`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
`;

export default function MyReaquests() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const requestQuery = query(
        collection(db, `users/${user?.uid}/quotes`),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(requestQuery);
      const request = snapshot.docs.map((doc) => {
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
      setRequests(request);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
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
  const onClick = () => {
    navigate(`/quotes`);
  };
  const renderItem = (request: MyRequest) => (
    <RequestBox onClick={onClick} key={request.id}>
      <RequestID>요청 번호: {request.id}</RequestID>
      <RequestDate>
        요청한 날짜: {timestampToDate(new Date(request.createdAt))}
      </RequestDate>
      <RequestContent>요청 내용: {request.desiredTreatment}</RequestContent>
    </RequestBox>
  );
  return (
    <Wrapper>
      <Title>{user?.displayName}님이 보낸 요청들</Title>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <RequestList>
          {requests.length === 0 ? (
            <NoRequest>
              <Switcher>
                아직 보낸 요청이 없습니다{" "}
                <Link to="/quotation">요청을 보내보세요!</Link>
              </Switcher>
            </NoRequest>
          ) : (
            requests.map(renderItem)
          )}
        </RequestList>
      )}
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
