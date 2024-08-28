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

const Container = styled.div`
  width: 120%;
  background-color: grey;
`;

const QuestionRow = styled.span`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  border: 1px solid white;
`;

const QuestionText = styled.span`
  color: white;
  width: 45%;
  border-right: 1px solid white;
`;

const Options = styled.span`
  color: white;
  width: 55%;
  display: flex;
  flex-direction: column;
`;

const OptionRow = styled.span`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const CheckBox = styled.input`
  width: 5%;
`;

const CheckBoxText = styled.span`
  color: white;
`;

const DiseaseContainer = styled.div`
  width: 25%;
`;

const EtcContainer = styled.div`
  width: 50%;
`;

const EtcCheckBox = styled.input`
  width: 10%;
`;

const DiseaseCheckBox = styled.input`
  width: 20%;
`;

const DiseaseCheckBoxText = styled.span`
  color: white;
  width: 10%;
`;

const EtcInput = styled.input`
  color: black;
  width: 50%;
`;

const QuestionInput = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  margin: 5px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
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

const PregnancyInput = styled.input`
  color: black;
  width: 15%;
`;

export default function Request() {
  const navigate = useNavigate();
  const FILE_SIZE_LIMIT = 1 * 1024 * 1024;
  const [desiredTreatment, setDesiredTreatment] = useState("");
  const [xrayFile, setXrayFile] = useState<File | null>(null);
  const [ctFile, setCtFile] = useState<File | null>(null);
  const [isDesiredTreatmentClicked, setIsDesiredTreatmentClicked] =
    useState(false);
  const [isSystemicDiseaseClicked, setIsSystemicDiseaseClicked] =
    useState(false);
  const [surgeryCheck, setsurgeryCheck] = useState<boolean | null>(null);
  const [surgeryDetail, setSurgeryDetail] = useState("");
  const [diseaseCheck, setDiseaseCheck] = useState<boolean | null>(null);
  const [diseaseDetail, setDiseaseDetail] = useState("");
  const [medicineCheck, setMedicineCheck] = useState<boolean | null>(null);
  const [medicineDetail, setMedicineDetail] = useState("");
  const [allergyCheck, setAllergyCheck] = useState<boolean | null>(null);
  const [allergyDetail, setAllergyDetail] = useState("");
  const [lactationCheck, setLactationCheck] = useState<boolean | null>(null);
  const [pregnancyDetail, setPregnancyDetail] = useState("");
  const [pregnancyCheck, setPregnancyCheck] = useState<boolean | null>(null);
  const [hypertension, setHypertension] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [heartDisease, setHeartDisease] = useState(false);
  const [hepatitis, setHepatitis] = useState(false);
  const [gastricDisease, setGastricDisease] = useState(false);
  const [kidneyDisease, setKidneyDisease] = useState(false);
  const [asthma, setAsthma] = useState(false);
  const [sinusitis, setSinusitis] = useState(false);
  const [cancer, setCancer] = useState(false);
  const [etcCheck, setEtcCheck] = useState(false);
  const [etc, setEtc] = useState("");
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
  const onSystemicDiseaseClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSystemicDiseaseClicked) {
      setIsSystemicDiseaseClicked(false);
    } else setIsSystemicDiseaseClicked(true);
  };
  const onDesiredTreatmentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDesiredTreatment(e.target.value);
  };
  const onSurgeryDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSurgeryDetail(e.target.value);
  };
  const onDiseaseDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDiseaseDetail(e.target.value);
  };
  const onMedicineDetailChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMedicineDetail(e.target.value);
  };
  const onAllergyDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAllergyDetail(e.target.value);
  };
  const onPregnancyDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPregnancyDetail(e.target.value);
  };
  const onEtcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEtc(e.target.value);
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
  const inputCheck = () => {
    return (
      surgeryCheck !== null &&
      diseaseCheck !== null &&
      medicineCheck !== null &&
      allergyCheck !== null
    );
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
    } else if (!inputCheck()) {
      setError("문진표 작성을 완료해주세요!");
      return;
    }
    try {
      setUploading(true);
      const doc = await addDoc(collection(db, `users/${user.uid}/requests`), {
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
        <Button onClick={onSystemicDiseaseClicked}>문진표 작성하기</Button>
        {isSystemicDiseaseClicked ? (
          <Container>
            <QuestionRow>
              <QuestionText>
                치과치료 외에 수술이나 입원 경력이 있습니까?
              </QuestionText>
              <Options>
                <OptionRow>
                  <CheckBox
                    type="checkbox"
                    checked={surgeryCheck === true ? true : false}
                    onChange={() => setsurgeryCheck(true)}
                  />
                  <CheckBoxText>없었다.</CheckBoxText>
                  <CheckBox
                    type="checkbox"
                    checked={surgeryCheck === false ? true : false}
                    onChange={() => setsurgeryCheck(false)}
                  />
                  <CheckBoxText>있었다.</CheckBoxText>
                </OptionRow>
                {surgeryCheck === false ? (
                  <QuestionInput
                    onChange={onSurgeryDetailChange}
                    value={surgeryDetail}
                    placeholder="구체적으로 입력해주세요"
                  />
                ) : null}
              </Options>
            </QuestionRow>
            <QuestionRow>
              <QuestionText>현재 치료 중인 질환이 있으십니까?</QuestionText>
              <Options>
                <OptionRow>
                  <CheckBox
                    type="checkbox"
                    checked={diseaseCheck === true ? true : false}
                    onChange={() => setDiseaseCheck(true)}
                  />
                  <CheckBoxText>없다.</CheckBoxText>
                  <CheckBox
                    type="checkbox"
                    checked={diseaseCheck === false ? true : false}
                    onChange={() => setDiseaseCheck(false)}
                  />
                  <CheckBoxText>있다.</CheckBoxText>
                </OptionRow>
                {diseaseCheck === false ? (
                  <QuestionInput
                    onChange={onDiseaseDetailChange}
                    value={diseaseDetail}
                    placeholder="구체적으로 입력해주세요"
                  />
                ) : null}
              </Options>
            </QuestionRow>
            <QuestionRow>
              <QuestionText>현재 복용 중인 약이 있으십니까?</QuestionText>
              <Options>
                <OptionRow>
                  <CheckBox
                    type="checkbox"
                    checked={medicineCheck === true ? true : false}
                    onChange={() => setMedicineCheck(true)}
                  />
                  <CheckBoxText>없다.</CheckBoxText>
                  <CheckBox
                    type="checkbox"
                    checked={medicineCheck === false ? true : false}
                    onChange={() => setMedicineCheck(false)}
                  />
                  <CheckBoxText>있다.</CheckBoxText>
                </OptionRow>
                {medicineCheck === false ? (
                  <QuestionInput
                    onChange={onMedicineDetailChange}
                    value={medicineDetail}
                    placeholder="구체적으로 입력해주세요"
                  />
                ) : null}
              </Options>
            </QuestionRow>
            <QuestionRow>
              <QuestionText>알러지가 있는 약물이 있으십니까?</QuestionText>
              <Options>
                <OptionRow>
                  <CheckBox
                    type="checkbox"
                    checked={allergyCheck === true ? true : false}
                    onChange={() => setAllergyCheck(true)}
                  />
                  <CheckBoxText>없다.</CheckBoxText>
                  <CheckBox
                    type="checkbox"
                    checked={allergyCheck === false ? true : false}
                    onChange={() => setAllergyCheck(false)}
                  />
                  <CheckBoxText>있다.</CheckBoxText>
                </OptionRow>
                {allergyCheck === false ? (
                  <QuestionInput
                    onChange={onAllergyDetailChange}
                    value={allergyDetail}
                    placeholder="구체적으로 입력해주세요"
                  />
                ) : null}
              </Options>
            </QuestionRow>
            <QuestionRow>
              <QuestionText>임신 또는 수유중이십니까?</QuestionText>
              <Options>
                <OptionRow>
                  <CheckBox
                    type="checkbox"
                    checked={pregnancyCheck === true ? true : false}
                    onChange={() => {
                      if (pregnancyCheck) {
                        setPregnancyCheck(false);
                      } else {
                        setPregnancyCheck(true);
                      }
                    }}
                  />
                  <CheckBoxText>임신중</CheckBoxText>
                  {pregnancyCheck === true ? (
                    <PregnancyInput
                      onChange={onPregnancyDetailChange}
                      value={pregnancyDetail}
                      placeholder="  개월"
                    />
                  ) : null}
                  <CheckBox
                    type="checkbox"
                    checked={lactationCheck === false ? true : false}
                    onChange={() => {
                      if (lactationCheck) {
                        setLactationCheck(false);
                      } else {
                        setLactationCheck(true);
                      }
                    }}
                  />
                  <CheckBoxText>수유중</CheckBoxText>
                </OptionRow>
              </Options>
            </QuestionRow>
            <QuestionRow>
              <QuestionText>전신질환이 있으시면 어떤 질환입니까?</QuestionText>
              <Options>
                <OptionRow>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={hypertension}
                      onChange={() => setHypertension(!hypertension)}
                    />
                    <DiseaseCheckBoxText>고혈압</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={diabetes}
                      onChange={() => setDiabetes(!diabetes)}
                    />
                    <DiseaseCheckBoxText>당뇨</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={stroke}
                      onChange={() => setStroke(!stroke)}
                    />
                    <DiseaseCheckBoxText>뇌졸중</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={heartDisease}
                      onChange={() => setHeartDisease(!heartDisease)}
                    />
                    <DiseaseCheckBoxText>심장병</DiseaseCheckBoxText>
                  </DiseaseContainer>
                </OptionRow>
                <OptionRow>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={hepatitis}
                      onChange={() => setHepatitis(!hepatitis)}
                    />
                    <DiseaseCheckBoxText>간염</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={gastricDisease}
                      onChange={() => setGastricDisease(!gastricDisease)}
                    />
                    <DiseaseCheckBoxText>위장질환</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={kidneyDisease}
                      onChange={() => setKidneyDisease(!kidneyDisease)}
                    />
                    <DiseaseCheckBoxText>신장질환</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={asthma}
                      onChange={() => setAsthma(!asthma)}
                    />
                    <DiseaseCheckBoxText>천식</DiseaseCheckBoxText>
                  </DiseaseContainer>
                </OptionRow>
                <OptionRow>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={sinusitis}
                      onChange={() => setSinusitis(!sinusitis)}
                    />
                    <DiseaseCheckBoxText>축농증</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <DiseaseContainer>
                    <DiseaseCheckBox
                      type="checkbox"
                      checked={cancer}
                      onChange={() => setCancer(!cancer)}
                    />
                    <DiseaseCheckBoxText>암</DiseaseCheckBoxText>
                  </DiseaseContainer>
                  <EtcContainer>
                    <EtcCheckBox
                      type="checkbox"
                      checked={etcCheck === true ? true : false}
                      onChange={() => {
                        etcCheck ? setEtcCheck(false) : setEtcCheck(true);
                      }}
                    />
                    <DiseaseCheckBoxText>기타</DiseaseCheckBoxText>
                    {etcCheck ? (
                      <EtcInput value={etc} onChange={onEtcChange} />
                    ) : null}
                  </EtcContainer>
                </OptionRow>
              </Options>
            </QuestionRow>
          </Container>
        ) : null}
        <Button onClick={onDesiredTreatmentClicked}>
          원하는 치료 입력하기
        </Button>
        {isDesiredTreatmentClicked ? (
          <TextArea
            onChange={onDesiredTreatmentChange}
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
