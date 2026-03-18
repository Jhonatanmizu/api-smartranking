import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Success' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
