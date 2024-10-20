import { useForm } from "react-hook-form";
import { Flex } from "rebass/styled-components";
import React, { FC, useState } from "react";
import axios from "axios";

import { getAxiosConfig } from "../../utils";
import { useMessage } from "../../hooks";
import { TextInput } from "../Input";
import { APIv2 } from "../../consts";
import { Button } from "../Button";
import Text, { H2 } from "../Text";
import { Col } from "../Layout";
import Icon from "../Icon";

interface FormData {
  password: string;
}

const SettingsPassword: FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useMessage(2000);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (loading) return;
    setLoading(true);
    setMessage();
    try {
      const res = await axios.post(
        APIv2.AuthChangePassword,
        data,
        getAxiosConfig()
      );
      reset();
      setMessage(res.data.message, "green");
    } catch (err) {
      setMessage(err?.response?.data?.error || "Couldn't update the password.");
    }
    setLoading(false);
  };

  return (
    <Col alignItems="flex-start" maxWidth="100%">
      <H2 mb={4} bold>
        Change password
      </H2>
      <Text mb={4}>Enter a new password to change your current password.</Text>
      <Text
        as="label"
        mb={[2, 3]}
        fontSize={[15, 16]}
        bold
      >
        New password:
      </Text>
      <Flex as="form" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          {...register("password", {
            required: "Password is required",
            validate: (value) => {
              const val = value.trim();
              if (val.length < 8) {
                return "Password must be at least 8 characters.";
              }
            },
          })}
          autocomplete="off"
          placeholder="New password..."
          width={[1, 2 / 3]}
          mr={3}
          required
        />
        <Button type="submit" disabled={loading}>
          <Icon name={loading ? "spinner" : "refresh"} mr={2} stroke="white" />
          {loading ? "Updating..." : "Update"}
        </Button>
      </Flex>
      <Text color={message.color} mt={3} fontSize={15}>
        {message.text}
      </Text>
    </Col>
  );
};

export default SettingsPassword;
