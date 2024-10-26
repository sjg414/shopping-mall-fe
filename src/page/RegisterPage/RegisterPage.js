import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./style/register.style.css";

import { registerUser } from "../../features/user/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { loading, registrationError } = useSelector((state) => state.user);

  //회원가입
  const register = (event) => {
    event.preventDefault(); //새로고침 방지
    const { name, email, password, confirmPassword, policy } = formData; //입력값 가져오기
    const checkConfirmPassword = password === confirmPassword; //패스워드 확인
    if (!checkConfirmPassword) {
      //패스워드가 일치하지 않으면
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }
    if (!policy) {
      //policy 체크가 되어있지 않으면
      setPolicyError(true);
      return;
    }
    //error reset
    setPasswordError("");
    setPolicyError(false);
    dispatch(registerUser({ name, email, password, navigate })); //리듀서로 액션 던지기
  };

  //입력 값 받기
  const handleChange = (event) => {
    event.preventDefault();
    let { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <Container className="register-area">
      {registrationError && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy} //이용약관 체크
          />
        </Form.Group>
        {loading ? (
          <Button variant="danger" type="submit" disabled>
            진행중
          </Button>
        ) : (
          <Button variant="danger" type="submit">
            회원가입
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default RegisterPage;
