import {
  Text,
  Stack,
  Heading,
  Button,
  Flex,
  Input,
  InputGroup,
  Icon,
  InputRightElement,
  HStack,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { isEqual } from 'lodash';

import ReleaseCard from 'components/releases/ReleaseCard';

import DashboardLayout from 'components/layouts/DashboardLayout';
import { EnrichedRelease, ReleaseType } from 'types';
import { useQuery } from 'react-query';
import { fetchReleases } from 'queries/releases';
import { BiSearch } from 'react-icons/bi';
import useDebounce from 'hooks/useDebounce';
import ReleaseList from 'components/releases/ReleaseList';
import { SortByOptions, SortOrder } from 'queries/types';
import { getServerSideSessionOrRedirect } from 'ssr/getServerSideSessionOrRedirect';
import { Artist } from '.prisma/client';
import useAppColors from 'hooks/useAppColors';

interface SortBySelectOption<T> {
  label: string;
  value: SortByOptions<T>;
}

const sortOptions: SortBySelectOption<EnrichedRelease>[] = [
  {
    label: 'Release Date (asc)',
    value: {
      key: 'targetDate',
      order: SortOrder.ASC,
    },
  },
  {
    label: 'Release Date (desc)',
    value: {
      key: 'targetDate',
      order: SortOrder.DESC,
    },
  },
  {
    label: 'Name (A-Z)',
    value: {
      key: 'name',
      order: SortOrder.ASC,
    },
  },
  {
    label: 'Name (Z-A)',
    value: {
      key: 'name',
      order: SortOrder.DESC,
    },
  },
];

const Releases = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBySelectOption<EnrichedRelease>>(
    sortOptions[0]
  );

  const { bgPrimary } = useAppColors();

  const debouncedSearch = useDebounce(search, 300);

  const queryArgs = {
    search: debouncedSearch,
    sorting: {
      key: sortBy.value.key,
      order: sortBy.value.order,
    },
  };

  const { data: response, isLoading } = useQuery(['releases', queryArgs], () =>
    fetchReleases(queryArgs)
  );

  return (
    <Stack
      bg={bgPrimary}
      flex={1}
      align="center"
      py={6}
      direction="column"
      width="100%"
    >
      <Stack spacing={4} width="90%" maxW="container.lg">
        <Flex align="center" justify="space-between">
          <Heading
            py={4}
            size="2xl"
            color={'red'}
            fontWeight="black"
            alignSelf="flex-start"
          >
            All Releases
          </Heading>
          <Button href={'/releases/new'} colorScheme="purple" as={'a'}>
            Create New Release
          </Button>
        </Flex>
        <HStack justifyContent="space-between">
          <InputGroup maxW="400px">
            <Input
              placeholder="Search releases..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <InputRightElement>
              <Icon as={BiSearch} />
            </InputRightElement>
          </InputGroup>
          <HStack>
            <Text whiteSpace="nowrap" fontSize="sm" fontWeight="bold">
              Sort by:
            </Text>
            <Select
              value={JSON.stringify(sortBy)}
              onChange={(e) => {
                const valueAsObj = JSON.parse(e.target.value);
                const item = sortOptions.find((item) =>
                  isEqual(item, valueAsObj)
                );

                setSortBy(item ?? sortOptions[0]);
              }}
            >
              {sortOptions.map((item) => (
                <option key={item.label} value={JSON.stringify(item)}>
                  {item.label}
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>
        {isLoading ? (
          <ReleaseCard
            releaseData={{
              id: 'release_loading',
              artist: { name: 'me', id: 'loading' } as Artist,
              targetDate: new Date().toISOString(),
              name: 'Loading',
              type: ReleaseType.ALBUM,
            }}
            loading
          />
        ) : (
          <ReleaseList releases={response?.data} search={debouncedSearch} />
        )}
      </Stack>
    </Stack>
  );
};

export const getServerSideProps = getServerSideSessionOrRedirect;

Releases.getLayout = () => DashboardLayout;

export default Releases;
