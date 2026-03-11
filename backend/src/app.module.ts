import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaptureModule } from './capture/capture.module';
import { GraphModule } from './graph/graph.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    CaptureModule,
    GraphModule,
  ],
})
export class AppModule {}
