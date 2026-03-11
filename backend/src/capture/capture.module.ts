import { Module } from '@nestjs/common';
import { CaptureController, NodesController, TagsController } from './capture.controller';
import { CaptureService } from './capture.service';
import { ExtractionService } from './extraction.service';

@Module({
  controllers: [CaptureController, NodesController, TagsController],
  providers: [CaptureService, ExtractionService],
  exports: [CaptureService],
})
export class CaptureModule {}
