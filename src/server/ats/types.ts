import type { SourceKind, WorkplaceType } from '@prisma/client';
export type NormalizedJob = {
  source: SourceKind; externalId: string; title: string; company: string; location?: string;
  workplaceType?: WorkplaceType; employmentType?: string; salaryMin?: number; salaryMax?: number;
  salaryCurrency?: string; url: string; description: string; postedAt?: Date; expiresAt?: Date;
};
