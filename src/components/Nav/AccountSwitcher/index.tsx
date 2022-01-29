import {
  Avatar,
  HStack,
  Icon,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { BiCog, BiLogOut } from 'react-icons/bi';
import { useRouter } from 'next/router';

import { AccountSwitcherButton } from './AccountSwitcherButton';

import useExtendedSession from 'hooks/useExtendedSession';
import useUser from 'hooks/useUser';
import useAppColors from 'hooks/useAppColors';

export const AccountSwitcher = () => {
  const { token, currentTeam, onChangeTeam, status } = useExtendedSession();
  const router = useRouter();
  const [userData] = useUser();
  const { bodySub, border } = useAppColors();

  const sessionLoading = status === 'loading';

  const onLogout = async () => {
    localStorage.removeItem('activeTeam');
    signOut({ callbackUrl: '/login' });
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
          userName={(userData?.name || (token?.name as string)) ?? 'loadingUser'}
          photoUrl={activeTeam?.team.imageUrl as string}
        />
      </Skeleton>
      <MenuList
        shadow="xl"
        py="4"
        spacing={5}
        borderColor={border}
        color={useColorModeValue('gray.600', 'gray.200')}
      >
        <Stack>
          <HStack px={4} fontSize="xs" color={bodySub}>
            <Avatar
              size="2xs"
              src={userData?.image as string}
              name={userData?.name || (token?.name as string)}
            />
            <Text fontSize="xs">{token?.email}</Text>
          </HStack>
          <MenuOptionGroup
            type="radio"
            title="Teams"
            defaultValue={currentTeam as string}
            value={currentTeam as string}
            onChange={(val) => onChangeTeam(val as string)}
          >
            {userTeams?.map(({ team }, index) => (
              <MenuItemOption
                key={index.toString()}
                value={team.id}
                fontWeight="semibold"
                type="radio"
              >
                <HStack>
                  <Avatar
                    size="sm"
                    borderRadius="md"
                    objectFit="cover"
                    src={team.imageUrl ?? ''}
                    referrerPolicy="no-referrer"
                    alt="Team Image"
                    name={team.name}
                  />
                  <Text>{team.name}</Text>
                </HStack>
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem
              icon={<Icon as={BiCog} fontSize="lg" />}
              onClick={() => router.push('/user/settings')}
            >
              User settings
            </MenuItem>

            <MenuItem icon={<Icon as={BiLogOut} fontSize="lg" />} onClick={onLogout}>
              Log out
            </MenuItem>
          </MenuGroup>
        </Stack>
      </MenuList>
    </Menu>
  );
};
