import { minLength, required, schema } from '@angular/forms/signals';

import type { RawTask } from '@mbau/dtos';

export const taskTitleSchema = schema<RawTask['title']>((title) => {
  const minChar = 5;

  required(title, { message: 'Title is required' });
  minLength(title, minChar, {
    message: `Title should be minimum of ${minChar} characters`,
  });
});

export const taskDescriptionSchema = schema<RawTask['description']>(
  (description) => {
    const minChar = 20;

    required(description, { message: 'Description is required' });
    minLength(description, minChar, {
      message: `Description should be minimum of ${minChar} characters`,
    });
  }
);
