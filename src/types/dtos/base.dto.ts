import { ApiProperty } from '@nestjs/swagger';
export class BaseDto {
  @ApiProperty({
    description: 'The unique identifier of the resource',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;
  @ApiProperty({
    description: 'The date and time when the resource was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The date and time when the resource was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
