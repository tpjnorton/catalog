import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { BiCog, BiLogOut } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { AccountSwitcherButton } from './AccountSwitcherButton';

import { ExtendedSession } from 'types';
import useExtendedSession from 'hooks/useExtendedSession';
import useUser from 'hooks/useUser';

export const AccountSwitcher = () => {
  const { token, currentTeam, onChangeTeam, status } = useExtendedSession();
  const router = useRouter();
  const [userData] = useUser();

  const sessionLoading = status === 'loading';

  const onLogout = async () => {
    localStorage.removeItem('activeTeam');
    signOut();
  };

  const userTeams = userData?.teams || token?.teams;

  const activeTeam = useMemo(() => {
    return userTeams?.find((item) => item.teamId === currentTeam);
  }, [currentTeam, userTeams]);

  return (
    <Menu>
      <Skeleton rounded="lg" isLoaded={!sessionLoading}>
        <AccountSwitcherButton
          teamName={(activeTeam?.team.name as string) ?? 'loadingTeam'}
          userName={
            (userData?.name || (token?.name as string)) ?? 'loadingUser'
          }
          photoUrl={token?.picture as string}
        />
      </Skeleton>
      <MenuList
        shadow="lg"
        py="4"
        color={useColorModeValue('gray.600', 'gray.200')}
        px="3"
      >
        <Text fontWeight="medium" mb="2" fontSize="sm">
          {token?.email}
        </Text>
        <MenuOptionGroup
          type="radio"
          defaultValue={currentTeam as string}
          value={currentTeam as string}
          onChange={(val) => onChangeTeam(val as string)}
        >
          {userTeams?.map(({ team }, index) => (
            <MenuItemOption
              key={index.toString()}
              value={team.id}
              fontWeight="semibold"
              rounded="md"
              type="radio"
            >
              {team.name}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem
          icon={<BiCog />}
          onClick={() => router.push('/user/settings')}
        >
          User settings
        </MenuItem>

        <MenuItem icon={<BiLogOut />} onClick={onLogout}>
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
