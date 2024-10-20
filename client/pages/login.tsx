import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from "react";
import { Flex } from "rebass/styled-components";
import emailValidator from "email-validator";
import styled from "styled-components";
import Router from "next/router";
import axios from "axios";

import { useStoreState, useStoreActions } from "../store";
import { APIv2, DISALLOW_REGISTRATION } from "../consts";
import { ColCenterV } from "../components/Layout";
import AppWrapper from "../components/AppWrapper";
import { TextInput } from "../components/Input";
import { fadeIn } from "../helpers/animations";
import { Button } from "../components/Button";
import Text, { H2 } from "../components/Text";
import ALink from "../components/ALink";
import Icon from "../components/Icon";

const LoginForm = styled(Flex).attrs({
  as: "form",
  flexDirection: "column"
})`
  animation: ${fadeIn} 0.8s ease-out;
`;

const Email = styled.span`
  font-weight: normal;
  color: #512da8;
  border-bottom: 1px dotted #999;
`;

const LoginPage = () => {
  const { isAuthenticated } = useStoreState((s) => s.auth);
  const login = useStoreActions((s) => s.auth.login);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState({ login: false, signup: false });
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<{ email: string; password: string }>();


  useEffect(() => {
    if (isAuthenticated) Router.push("/");
  }, [isAuthenticated]);

  function onSubmit(type: "login" | "signup") {
    return async (data: { email: string; password: string }) => {
      const { email, password } = data;
      if (loading.login || loading.signup) return null;

      if (!email) {
        return setError("Email address must not be empty.");
      }

      if (!emailValidator.validate(email)) {
        return setError("Email address is not valid.");
      }

      if (password.trim().length < 8) {
        return setError("Password must be at least 8 chars long.");
      }

      setError("");

      if (type === "login") {
        setLoading((s) => ({ ...s, login: true }));
        try {
          await login(data);
          Router.push("/");
        } catch (error) {
          setError(error.response.data.error);
        }
      }

      if (type === "signup" && !DISALLOW_REGISTRATION) {
        setLoading((s) => ({ ...s, signup: true }));
        try {
          await axios.post(APIv2.AuthSignup, { email, password });
          setVerifying(true);
        } catch (error) {
          setError(error.response.data.error);
        }
      }

      setLoading({ login: false, signup: false });
    };
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <AppWrapper>
      <ColCenterV maxWidth="100%" px={3} flex="0 0 auto" mt={4}>
        {verifying ? (
          <H2 textAlign="center" light>
            A verification email has been sent to{" "}
            <Email>{getValues("email")}</Email>
          </H2>
        ) : (
          <LoginForm id="login-form" onSubmit={handleSubmit(onSubmit("login"))}>
            <Text as="label" mb={2} bold>
              Email address:
            </Text>
            <TextInput
              {...register("email", { required: "Email is required", validate: emailValidator.validate })}
              placeholder="Email address..."
              height={[56, 64, 72]}
              fontSize={[15, 16]}
              px={[4, 40]}
              mb={[24, 4]}
              width={[300, 400]}
              maxWidth="100%"
              autoFocus
            />
            {errors.email && <Text color="red" mt={1}>{errors.email.message}</Text>}
            <Text as="label" mb={2} bold>
              Password{!DISALLOW_REGISTRATION ? " (min chars: 8)" : ""}:
            </Text>
            <TextInput
              {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 chars long" } })}
              placeholder="Password..."
              px={[4, 40]}
              height={[56, 64, 72]}
              fontSize={[15, 16]}
              width={[300, 400]}
              maxWidth="100%"
              mb={[24, 4]}
            />
            {errors.password && <Text color="red" mt={1}>{errors.password.message}</Text>}
            <Flex justifyContent="center">
              <Button
                flex="1 1 auto"
                mr={!DISALLOW_REGISTRATION ? ["8px", 16] : 0}
                height={[44, 56]}
                type="submit"
              >
                <Icon
                  name={loading.login ? "spinner" : "login"}
                  stroke="white"
                  mr={2}
                />
                Log in
              </Button>
              {!DISALLOW_REGISTRATION && (
                <Button
                  flex="1 1 auto"
                  ml={["8px", 16]}
                  height={[44, 56]}
                  color="purple"
                  onClick={handleSubmit(onSubmit("signup"))}
                >
                  <Icon
                    name={loading.signup ? "spinner" : "signup"}
                    stroke="white"
                    mr={2}
                  />
                  Sign up
                </Button>
              )}
            </Flex>
            <ALink
              href="/reset-password"
              title="Forget password"
              fontSize={14}
              alignSelf="flex-start"
              my={16}
              isNextLink
            >
              Forgot your password?
            </ALink>
            <Text color="red" mt={1} normal>
              {error}
            </Text>
          </LoginForm>
        )}
      </ColCenterV>
    </AppWrapper>
  );
};

export default LoginPage;
