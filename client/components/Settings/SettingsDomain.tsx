import { useForm } from "react-hook-form";
import { Flex } from "rebass/styled-components";
import React, { FC, useState } from "react";
import styled from "styled-components";
import getConfig from "next/config";

import { useStoreState, useStoreActions } from "../../store";
import { Domain } from "../../store/settings";
import { errorMessage } from "../../utils";
import { useMessage } from "../../hooks";
import Text, { H2, Span } from "../Text";
import { Colors } from "../../consts";
import { TextInput } from "../Input";
import { Button } from "../Button";
import { Col } from "../Layout";
import Table from "../Table";
import Modal from "../Modal";
import Icon from "../Icon";

const { publicRuntimeConfig } = getConfig();

const Th = styled(Flex).attrs({ as: "th", py: 3, px: 3 })`
  font-size: 15px;
`;
const Td = styled(Flex).attrs({ as: "td", py: 12, px: 3 })`
  font-size: 15px;
`;


interface FormData {
  address: string;
  homepage: string;
}

const SettingsDomain: FC = () => {
  const { saveDomain, deleteDomain } = useStoreActions((s) => s.settings);
  const [domainToDelete, setDomainToDelete] = useState<Domain>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const domains = useStoreState((s) => s.settings.domains);
  const [message, setMessage] = useMessage(2000);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await saveDomain(data);
      setMessage("Domain added successfully!", "green");
      reset();
    } catch (err) {
      setMessage(errorMessage(err, "Couldn't add domain."));
    }
    setLoading(false);
  };

  const closeModal = () => {
    setDomainToDelete(null);
    setModal(false);
  };

  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDomain(domainToDelete!.id);
      setMessage("Domain has been deleted successfully.", "green");
    } catch (err) {
      setMessage(errorMessage(err, "Couldn't delete the domain."));
    }
    closeModal();
    setDeleteLoading(false);
  };

  return (
    <Col alignItems="flex-start" maxWidth="100%">
      <H2 mb={4} bold>
        Custom domain
      </H2>
      <Text mb={3}>
        You can set a custom domain for your short URLs, so instead of{" "}
        <b>{publicRuntimeConfig.DEFAULT_DOMAIN}/shorturl</b> you can have{" "}
        <b>example.com/shorturl.</b>
      </Text>
      <Text mb={4}>
        Point your domain A record to <b>192.64.116.170</b> then add the domain
        via form below:
      </Text>
      {domains.length > 0 && (
        <Table my={3} scrollWidth="550px">
          <thead>
            <tr>
              <Th width={2 / 5}>Domain</Th>
              <Th width={2 / 5}>Homepage</Th>
              <Th width={1 / 5}></Th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.address}>
                <Td width={2 / 5}>{d.address}</Td>
                <Td width={2 / 5}>
                  {d.homepage || publicRuntimeConfig.DEFAULT_DOMAIN}
                </Td>
                <Td width={1 / 5} justifyContent="center">
                  <Icon
                    as="button"
                    name="trash"
                    stroke={Colors.TrashIcon}
                    strokeWidth="2.5"
                    backgroundColor={Colors.TrashIconBg}
                    py={0}
                    px={0}
                    size={[23, 24]}
                    p={["4px", "5px"]}
                    onClick={() => {
                      setDomainToDelete(d);
                      setModal(true);
                    }}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Col
        alignItems="flex-start"
        onSubmit={handleSubmit(onSubmit)}
        width={1}
        as="form"
        my={[3, 4]}
      >
        <Flex width={1} flexDirection={["column", "row"]}>
          <Col mr={[0, 2]} mb={[3, 0]} flex="0 0 auto">
            <Text
              as="label"
              mb={[2, 3]}
              fontSize={[15, 16]}
              bold
            >
              Domain:
            </Text>
            <TextInput
              {...register("address", { required: "Domain is required" })}
              placeholder="example.com"
              maxWidth="240px"
              required
            />
          </Col>
          {errors.address && (
            <Text color="red" mt={1}>
              {errors.address.message}
            </Text>
          )}
          <Col ml={[0, 2]} flex="0 0 auto">
            <Text
              as="label"
              mb={[2, 3]}
              fontSize={[15, 16]}
              bold
            >
              Homepage (optional):
            </Text>
            <TextInput
              {...register("homepage")}
              placeholder="Homepage URL"
              flex="1 1 auto"
              maxWidth="240px"
            />
          </Col>
        </Flex>
        <Button type="submit" color="purple" mt={[24, 3]} disabled={loading}>
          <Icon name={loading ? "spinner" : "plus"} mr={2} stroke="white" />
          {loading ? "Setting..." : "Set domain"}
        </Button>
      </Col>
      <Text color={message.color}>{message.text}</Text>
      <Modal id="delete-custom-domain" show={modal} closeHandler={closeModal}>
        <H2 mb={24} textAlign="center" bold>
          Delete domain?
        </H2>
        <Text textAlign="center">
          Are you sure do you want to delete the domain{" "}
          <Span bold>
            &quot;{domainToDelete && domainToDelete.address}&quot;
          </Span>
          ?
        </Text>
        <Flex justifyContent="center" mt={44}>
          {deleteLoading ? (
            <>
              <Icon name="spinner" size={20} stroke={Colors.Spinner} />
            </>
          ) : (
            <>
              <Button color="gray" mr={3} onClick={closeModal}>
                Cancel
              </Button>
              <Button color="red" ml={3} onClick={onDelete}>
                <Icon name="trash" stroke="white" mr={2} />
                Delete
              </Button>
            </>
          )}
        </Flex>
      </Modal>
    </Col>
  );
};

export default SettingsDomain;
