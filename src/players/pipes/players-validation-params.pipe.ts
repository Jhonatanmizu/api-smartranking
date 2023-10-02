import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export default class PlayerValidationParams implements PipeTransform {
  constructor() {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `The ${metadata.type} parameter is required`,
      );
    }
    return value;
  }
}
