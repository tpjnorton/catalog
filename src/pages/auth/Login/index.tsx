import {
  Button,
  Divider,
  Flex,
  HStack,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import FormContent from 'components/FormContent';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from 'reactfire';
import { loginConfig } from './loginConfig';
import { LoginData } from './types';
import firebase from 'firebase';
import GoogleButton from 'react-google-button';

const Login = () => {
  const { register, errors, handleSubmit } = useForm<LoginData>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const auth = useAuth();

  const onEmailPassSubmit = async ({ email, password }: LoginData) => {
    try {
      setLoading(true);
      const user = await auth.signInWithEmailAndPassword(email, password);
      if (!user) {
        toast({
          status: 'error',
          description: 'Your email or password is incorrect.',
        });
      }
    } catch (e) {
      toast({
        status: 'error',
        description: e.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar');

    try {
      setLoading(true);
      const result = await auth.signInWithPopup(provider);
      if (!result.user) {
        toast({
          status: 'error',
          description: 'Something went wrong...',
        });
      }
    } catch (e) {
      toast({
        status: 'error',
        description: e.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      flex={1}
      minH="100vh"
    >
      <Stack w={'80%'} maxW="400px" spacing={'40px'} alignItems="center">
        <Stack
          w="100%"
          spacing={2}
          as={'form'}
          onSubmit={handleSubmit(onEmailPassSubmit)}
        >
          <Text fontWeight="semibold" fontSize="3xl">
            Sign In
          </Text>
          <FormContent
            config={loginConfig}
            errors={errors}
            register={register}
          />
          <Button isLoading={loading} type="submit">
            Log in
          </Button>
          <Text color="grey" fontSize="sm" as={Link} to={'/sign-up'}>
            Don't have an account?
          </Text>
        </Stack>
        <HStack width="100%">
          <Divider colorScheme="blue" orientation="horizontal" />
          <Text color={'gray.400'} textTransform="uppercase">
            OR
          </Text>
          <Divider colorScheme="blue" orientation="horizontal" />
        </HStack>
        <GoogleButton onClick={signInWithGoogle} />
      </Stack>
    </Flex>
  );
};

export default Login;
