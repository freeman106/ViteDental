import styled from "styled-components";
import { Wrapper } from "../components/auth-components";
import { useNavigate } from "react-router-dom";

const Top = styled.h1`
  display: flex;
  text-align: center;
  width: 100%;
  font-size: 50px;
  margin: 20px;
  font-weight: 1000;
`;

const QuoteBox = styled.div`
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

const Hospital = styled.h1`
  font-size: 30px;
  font-weight: 1000;
  margin-bottom: 10px;
`;

const Fee = styled.h1`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
`;
const Title = styled.h1`
  font-size: 15px;
  font-weight: 800;
`;

interface Quote {
  id: number;
  hospital: string;
  fee: string;
  title: string;
  message: string;
}

export default function Quotes() {
  const navigate = useNavigate();
  const quotes = [
    {
      id: 1,
      hospital: "A 치과",
      fee: "480만원",
      title: "우리는 최고의 장비를 사용합니다.",
      message:
        "안녕하세요 님.OOO님.\n\
  저희 A 치과의 OOO님 최소 견적은 480 만원입니다.\n\
  파노라마 사진 상에 표시된 1 부위에는 ct 판독 결과 뼈이식 0.5cc가 필요할 것으로 사료되며\n\
  2부위에는 상악동 거상술 및 뼈이식이 필요할 것으로 판단됩니다. (병원측 ct 캡쳐 사진 첨부)\n\
  현재 오스템 sa 임플란트로 진행시 임플란트 식립 xx 만원 + 뼈이식 xx 만원 + 상악동 거상술 xx 만원이며\n\
  메가젠 블루 다이아몬드 임플란트로 진행시 임플란트 식립 xx 만원 + 뼈이식 xx 만원 + 상악동 거상술 xx 만원 입니다\n\
  저희 치과는 n년의 경력 치과이며 상세 대표원장님 경력은 링크 에서 확인 가능하십니다.\n",
    },
    {
      id: 2,
      hospital: "B 치과",
      fee: "520만원",
      title: "편안한 환경에서 치료받으세요.",
      message:
        "안녕하세요 님.OOO님.\n\
  저희 B 치과의 OOO님 최소 견적은 520 만원입니다.\n\
  파노라마 사진 상에 표시된 1 부위에는 ct 판독 결과 뼈이식 0.5cc가 필요할 것으로 사료되며\n\
  2부위에는 상악동 거상술 및 뼈이식이 필요할 것으로 판단됩니다. (병원측 ct 캡쳐 사진 첨부)\n\
  현재 오스템 sa 임플란트로 진행시 임플란트 식립 xx 만원 + 뼈이식 xx 만원 + 상악동 거상술 xx 만원이며\n\
  메가젠 블루 다이아몬드 임플란트로 진행시 임플란트 식립 xx 만원 + 뼈이식 xx 만원 + 상악동 거상술 xx 만원 입니다\n\
  저희 치과는 n년의 경력 치과이며 상세 대표원장님 경력은 링크 에서 확인 가능하십니다.\n",
    },
    {
      id: 3,
      hospital: "C 치과",
      fee: "580만원",
      title: "저렴한 가격에 최고의 서비스를 제공합니다.",
      message:
        "안녕하세요 님.OOO님.\n\
  저희 C 치과의 OOO님 최소 견적은 580 만원입니다.\n\
  파노라마 사진 상에 표시된 1 부위에는 ct 판독 결과 뼈이식 0.5cc가 필요할 것으로 사료되며\n\
  2부위에는 상악동 거상술 및 뼈이식이 필요할 것으로 판단됩니다. (병원측 ct 캡쳐 사진 첨부)\n\
  현재 오스템 sa 임플란트로 진행시 임플란트 식립 xx 만원 + 뼈이식 xx 만원 + 상악동 거상술 xx 만원이며\n\
  메가젠 블루 다이아몬드 임플란트로 진행시 임플란트 식립 xx 만원 + 뼈이식 xx 만원 + 상악동 거상술 xx 만원 입니다\n\
  저희 치과는 n년의 경력 치과이며 상세 대표원장님 경력은 링크 에서 확인 가능하십니다.\n",
    },
  ];
  const onClick = (quote: Quote) => {
    navigate(`/quote/${quote.id}`, { state: { quote } });
  };
  const renderItem = (quote: Quote) => (
    <QuoteBox onClick={() => onClick(quote)} key={quote.id}>
      <Hospital>{quote.hospital}</Hospital>
      <Fee>{quote.fee}</Fee>
      <Title>{quote.title}</Title>
    </QuoteBox>
  );
  return (
    <Wrapper>
      <Top>내가 받은 견적들</Top>
      {quotes.map(renderItem)}
    </Wrapper>
  );
}
