import {
  Box,
  Flex,
  FlexProps,
  HStack,
  Img,
  useMenuButton,
} from '@chakra-ui/react';
import * as React from 'react';
import { HiSelector } from 'react-icons/hi';

interface Props extends FlexProps {
  teamName: string;
  userName: string;
  photoUrl: string;
}

export const AccountSwitcherButton = ({
  teamName,
  userName,
  photoUrl,
  ...rest
}: Props) => {
  const buttonProps = useMenuButton(rest);
  return (
    <Flex
      as="button"
      {...buttonProps}
      w="full"
      display="flex"
      alignItems="center"
      rounded="lg"
      bg="gray.700"
      px="3"
      py="2"
      fontSize="sm"
      userSelect="none"
      cursor="pointer"
      outline="0"
      transition="all 0.2s"
      _active={{ bg: 'gray.600' }}
      _focus={{ shadow: 'outline' }}
    >
      <HStack flex="1" spacing="3">
        <Img
          w="8"
          h="8"
          rounded="md"
          objectFit="cover"
          src={photoUrl}
          alt="Chakra UI"
        />
        <Box textAlign="start">
          <Box isTruncated fontWeight="semibold">
            {teamName}
          </Box>
          <Box fontSize="xs" color="gray.400">
            {userName}
          </Box>
        </Box>
      </HStack>
      <Box fontSize="lg" color="gray.400">
        <HiSelector />
      </Box>
    </Flex>
  );
};
