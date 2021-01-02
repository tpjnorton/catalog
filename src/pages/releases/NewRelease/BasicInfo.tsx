import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import Card from 'components/Card';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirestore } from 'reactfire';
import { Release } from 'types';
import { basicInfoConfig } from './releaseConfig';
import { useHistory } from 'react-router-dom';
import FormContent from 'components/FormContent';

const BasicInfo = () => {
  const { register, errors, handleSubmit } = useForm<any>();
  const [loading, setLoading] = useState(false);
  const collectionRef = useFirestore().collection('releases');
  const toast = useToast();
  const history = useHistory();

  const onSubmit = async (data: Release) => {
    try {
      setLoading(true);
      const newDoc = await collectionRef.doc();
      await newDoc.set({ ...data, created: Date.now() });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Release created.',
      });
      history.push(`/releases/${newDoc.id}`);
    } catch (e) {
      toast({ status: 'error', title: 'Oh no...', description: e.toString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      flex={1}
      bg="#eee"
      align="center"
      direction="column"
      width="100%"
      height="100%"
    >
      <Stack py={8} spacing={3} width="90%" maxW="900px">
        <Heading>Create a new release</Heading>
        <Text>Enter the basic info about your release.</Text>
        <Stack as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
          <Card width="100%">
            <Stack py={6} spacing={6} width="100%" maxW="500px" margin="0 auto">
              <FormContent
                config={basicInfoConfig}
                errors={errors}
                register={register}
              />
              <Flex justify="flex-end">
                <Button
                  colorScheme="blue"
                  flexGrow={0}
                  rightIcon={<FiArrowRight />}
                  isLoading={loading}
                  type="submit"
                >
                  Create
                </Button>
              </Flex>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default BasicInfo;
