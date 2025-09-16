import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description:
      'JWT access token used for authenticating requests to protected endpoints.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjkwMDAwMDAwLCJleHAiOjE2OTAwMDM2MDB9.abc123def456ghi789',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'JWT refresh token used to obtain a new access token without re-login.',
    example: 'dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4=',
  })
  refreshToken: string;
}
