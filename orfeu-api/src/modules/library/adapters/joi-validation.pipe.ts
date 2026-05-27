import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  transform(value: unknown): unknown {
    const result = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      const messages = result.error.details.map((d) => d.message).join('; ');
      throw new BadRequestException(`Validation failed: ${messages}`);
    }

    return result.value;
  }
}
