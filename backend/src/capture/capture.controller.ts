import { Controller, Post, Body, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CaptureService } from './capture.service';
import { ExtractionService } from './extraction.service';
import { CapturePayloadDto, ExtractRequestDto, UpdateNodeDto } from './capture.dto';

@ApiTags('capture')
@Controller('capture')
export class CaptureController {
  constructor(
    private readonly captureService: CaptureService,
    private readonly extractionService: ExtractionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Capture content from browser extension or API' })
  @ApiResponse({ status: 201, description: 'Content captured successfully' })
  async capture(@Body() payload: CapturePayloadDto) {
    return this.captureService.capture(payload);
  }

  @Post('extract')
  @ApiOperation({ summary: 'Extract metadata from URL or content using AI' })
  @ApiResponse({ status: 200, description: 'Extraction results' })
  async extract(@Body() request: ExtractRequestDto) {
    return this.extractionService.extract(request);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently captured items' })
  async getRecent(@Query('limit') limit?: number) {
    return this.captureService.getRecent(limit || 20);
  }
}

@ApiTags('nodes')
@Controller('nodes')
export class NodesController {
  constructor(private readonly captureService: CaptureService) {}

  @Get()
  @ApiOperation({ summary: 'List all nodes with optional filtering' })
  async listNodes(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
  ) {
    return this.captureService.listNodes({
      page: page || 1,
      pageSize: pageSize || 20,
      type,
      search,
      tags: tags ? tags.split(',') : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single node by ID' })
  async getNode(@Param('id') id: string) {
    return this.captureService.getNode(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a node' })
  async updateNode(@Param('id') id: string, @Body() update: UpdateNodeDto) {
    return this.captureService.updateNode(id, update);
  }
}

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly captureService: CaptureService) {}

  @Get()
  @ApiOperation({ summary: 'List all tags' })
  async listTags() {
    return this.captureService.listTags();
  }

  @Post('suggest')
  @ApiOperation({ summary: 'Get AI-suggested tags for content' })
  async suggestTags(@Body() body: { content: string; existingTags?: string[] }) {
    return this.captureService.suggestTags(body.content, body.existingTags);
  }
}
