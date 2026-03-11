import { IsString, IsOptional, IsEnum, IsObject, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CaptureContextDto {
  @ApiPropertyOptional() @IsOptional() @IsString() selectedText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() surroundingText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageAlt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() videoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() pageMeta?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() elementPath?: string;
}

export class CaptureOptionsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() collectionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableAiExtraction?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() includeFields?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() excludeFields?: string[];
}

export class CapturePayloadDto {
  @ApiProperty({ enum: ['url', 'text', 'image', 'link', 'file', 'screenshot', 'code', 'video', 'mixed'] })
  @IsEnum(['url', 'text', 'image', 'link', 'file', 'screenshot', 'code', 'video', 'mixed'])
  captureType!: string;

  @ApiProperty({ description: 'Primary content (URL, text, image data URL, etc.)' })
  @IsString()
  content!: string;

  @ApiProperty({ description: 'Source page URL' })
  @IsString()
  sourceUrl!: string;

  @ApiProperty({ description: 'Source page title' })
  @IsString()
  sourceTitle!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  capturedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: CaptureContextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  options?: CaptureOptionsDto;
}

export class ExtractRequestDto {
  @ApiPropertyOptional({ description: 'URL to extract metadata from' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Content to analyze' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Type of capture' })
  @IsString()
  captureType!: string;
}

export class UpdateNodeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
