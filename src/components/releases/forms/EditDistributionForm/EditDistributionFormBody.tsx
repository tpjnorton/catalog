import { Stack, Flex, Button, ButtonGroup, HStack } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { TaskStatus } from '@prisma/client';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { BiArrowBack } from 'react-icons/bi';

import { EditDistributionFormData } from '../../specific/Distribution/types';

import { buildDistribConfig } from './distribConfig';

import FormContent from 'components/forms/FormContent';
import { fetchDistributors } from 'queries/distribution';
import { ReleaseWizardComponentProps } from 'components/releases/NewReleaseWizard/types';

const EditDistributionFormBody = ({
  onSubmit,
  onSkip,
  isSkippable,
  canGoBack,
  onBack,
  existingRelease,
  loading,
}: ReleaseWizardComponentProps<EditDistributionFormData>) => {
  const formattedDueDate = useMemo(
    () => dayjs(existingRelease?.distribution?.dueDate).format('YYYY-MM-DD'),
    [existingRelease?.distribution?.dueDate]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    control,
  } = useForm<EditDistributionFormData>({
    defaultValues: existingRelease?.distribution
      ? {
          ...existingRelease?.distribution,
          distributor: existingRelease?.distribution?.distributor?.id,
          dueDate: formattedDueDate,
        }
      : {},
  });

  const { data: distributors } = useQuery('distributors', fetchDistributors);

  const status = watch('status');

  useEffect(() => {
    reset({
      ...existingRelease?.distribution,
      distributor: existingRelease?.distribution?.distributorId,
      dueDate: formattedDueDate,
    });
  }, [existingRelease?.distribution, distributors, formattedDueDate, reset]);

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <Stack py={6} spacing={6} width="100%" maxW="600px" margin="0 auto">
        <FormContent
          config={buildDistribConfig(status === TaskStatus.COMPLETE, distributors ?? [])}
          control={control}
          errors={errors}
          register={register}
        />
        <HStack justify="space-between">
          <Flex>
            {canGoBack && (
              <Button variant="link" onClick={onBack} leftIcon={<BiArrowBack />}>
                Back
              </Button>
            )}
          </Flex>
          <ButtonGroup>
            {isSkippable && (
              <Button
                colorScheme="purple"
                variant="ghost"
                flexGrow={0}
                onClick={() => onSkip?.('distribution')}
              >
                Skip
              </Button>
            )}
            <Button
              colorScheme="purple"
              flexGrow={0}
              rightIcon={<FiSave />}
              isLoading={loading}
              type="submit"
            >
              Save
            </Button>
          </ButtonGroup>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default EditDistributionFormBody;
