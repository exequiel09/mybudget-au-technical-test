import { minLength, required, schema } from '@angular/forms/signals';

import type { RawTask } from '@mbau/dtos';
import {
  TASK_DESCRIPTION_MIN_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from '@mbau/validators';

export const taskTitleSchema = schema<RawTask['title']>((title) => {
  required(title, { message: 'Title is required' });
  minLength(title, TASK_TITLE_MIN_LENGTH, {
    message: `Title should be minimum of ${TASK_TITLE_MIN_LENGTH} characters`,
  });
});

export const taskDescriptionSchema = schema<RawTask['description']>(
  (description) => {
    required(description, { message: 'Description is required' });
    minLength(description, TASK_DESCRIPTION_MIN_LENGTH, {
      message: `Description should be minimum of ${TASK_DESCRIPTION_MIN_LENGTH} characters`,
    });
  }
);
