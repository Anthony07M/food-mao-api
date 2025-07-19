import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      message: 'Application is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
