import { HttpException } from '@storyofams/next-api-decorators';

export class ForbiddenException extends HttpException {
  public constructor(message?: string) {
    super(403, message ?? 'Forbidden');
  }
}
