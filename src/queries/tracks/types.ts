import { Track } from '@prisma/client';

import { FilterOptions } from 'queries/types';

export interface SingleTrackVars extends Pick<Track, 'name' | 'lyrics' | 'id'> {}

export interface CreateSingleTrackVars extends Omit<SingleTrackVars, 'id'> {
  releaseId: string;
  mainArtists: string[];
  featuringArtists?: string[];
}

export type CopyTrackVars = { releaseId: string; ids: string[] };

export type DeleteSingleTrackVars = Pick<SingleTrackVars, 'id'>;

export interface TrackFilterOptions extends FilterOptions<Track> {
  workspace: string;
}
