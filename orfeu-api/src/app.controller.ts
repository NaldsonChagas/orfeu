import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Returns a simple hello world string.',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/hello')
  @ApiOperation({
    summary: 'Get API hello',
    description: 'Returns a JSON hello message from the API.',
  })
  getApiHello(): { message: string } {
    return { message: 'Hello from NestJS!' };
  }
}
