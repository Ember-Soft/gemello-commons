import { Entity } from './Entity';

export interface IMapper<DomainEntity extends Entity<any>, DbRecord, Response = any> {
  toPersistance(entity: DomainEntity): DbRecord;
  toDomain(record: any): DomainEntity;
  toResponse(entity: DomainEntity): Response;
}
