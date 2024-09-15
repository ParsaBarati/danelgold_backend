import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, Repository } from 'typeorm';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PaginationService {
  async paginate<T>(
    source: Repository<T> | SelectQueryBuilder<T>,
    page: number = 1,
    limit: number = 10,
    where: any = {},
    order: any = {},
  ): Promise<PaginationResult<T>> {
    let data: T[];
    let total: number;

    if (source instanceof Repository) {
      [data, total] = await source.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order,
      });
    } else {
      [data, total] = await source
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
