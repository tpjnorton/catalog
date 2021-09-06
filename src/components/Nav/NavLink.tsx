import { Link, Text, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { NavBarLink } from './types';
import { useRouter } from 'next/router';

const NavLink = ({ href, text, activeRegex, icon }: NavBarLink) => {
  const router = useRouter();
  const isActive = activeRegex.test(router.pathname);

  const selectedBg = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', null);

  return (
    <NextLink href={href} passHref>
      <Link
        p={2}
        py={2}
        borderRadius={6}
        bg={isActive ? selectedBg : 'transparent'}
        fontWeight={'bold'}
        fontSize="sm"
      >
        <HStack color={textColor}>
          <Icon as={icon} fontSize="md" />
          <Text>{text}</Text>
        </HStack>
      </Link>
    </NextLink>
  );
};

export default NavLink;
