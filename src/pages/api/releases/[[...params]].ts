import {
  Body,
  createHandler,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@storyofams/next-api-decorators';

import { CreateReleaseDto } from 'backend/models/releases/create';

import { Release, ReleaseType } from '@prisma/client';
import requiresAuth from 'backend/apiUtils/auth';
import prisma from 'backend/prisma/client';
import { UpdateReleaseDto } from 'backend/models/releases/update';
import { SortByOptions, SortOrder } from 'queries/types';
import { CreateDistributionDto } from 'backend/models/distribution/create';

@requiresAuth()
class ReleaseListHandler {
  @Get()
  async releases(
    @Query('search') search: string,
    @Query('sortBy') sortBy: keyof Release,
    @Query('sortOrder') sortOrder: SortOrder
  ) {
    const releases = await prisma.release.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      orderBy: {
        [sortBy]: sortOrder ?? 'asc',
      },
      include: {
        artist: true,
        artwork: true,
      },
    });
    return releases;
  }

  @Get('/:id')
  async singleRelease(@Param('id') id: string) {
    if (!id) throw new NotFoundException();

    const release = await prisma.release.findUnique({
      where: {
        id,
      },
      include: {
        artist: true,
        artwork: true,
        distribution: true,
        marketing: true,
        musicVideo: true,
      },
    });

    return release;
  }

  @Post()
  @HttpCode(201)
  async createRelease(@Body(ValidationPipe) body: CreateReleaseDto) {
    const result = await prisma.release.create({
      data: {
        artist: { connect: { id: body.artist } },
        name: body.name,
        type: body.type as ReleaseType,
        targetDate: body.targetDate,
        team: {
          connect: { id: body.team },
        },
      },
    });
    return result;
  }

  @Put('/:id')
  async updateRelease(
    @Param('id') id: string,
    @Body(ValidationPipe) body: UpdateReleaseDto
  ) {
    if (!id) throw new NotFoundException();

    const result = await prisma.release.update({
      where: {
        id,
      },
      data: {
        artist: { connect: { id: body.artist } },
        name: body.name,
        type: body.type as ReleaseType,
        targetDate: body.targetDate,
      },
    });
    return result;
  }

  @Delete('/:id')
  async deleteRelease(@Param('id') id: string) {
    const result = await prisma.release.delete({
      where: {
        id,
      },
    });
    return result;
  }

  @Post('/:id/distribution')
  async createDistribution(
    @Param('id') id: string,
    @Body(ValidationPipe) body: CreateDistributionDto
  ) {
    const result = await prisma.distribution.create({
      data: {
        assignee: { connect: { id: body.assignee } },
        distributor: { connect: { id: body.distributor } },
        release: { connect: { id } },
        status: body.status,
        notes: body.notes,
        dueDate: body.dueDate,
      },
    });
    return result;
  }

  @Put('/:id/distribution')
  async updateDistribution(
    @Param('id') id: string,
    @Body(ValidationPipe) body: CreateDistributionDto
  ) {
    const result = await prisma.distribution.update({
      where: {
        releaseId: id,
      },
      data: {
        assignee: { connect: { id: body.assignee } },
        distributor: { connect: { id: body.distributor } },
        status: body.status,
        notes: body.notes,
        dueDate: body.dueDate,
      },
    });
    return result;
  }

  @Delete('/:id/distribution')
  async deleteDistribution(@Param('id') id: string) {
    const result = await prisma.distribution.delete({
      where: {
        releaseId: id,
      },
    });
    return result;
  }
}

export default createHandler(ReleaseListHandler);
