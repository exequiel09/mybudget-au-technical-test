import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import type { SortOptionKey } from '@mbau/task-management-state';

const sortOptions: Record<SortOptionKey, string> = {
  title: 'Title',
  status: 'Status',
  'date-created': 'Date Created',
};

@Component({
  selector: 'mbau-sort-control',
  imports: [KeyValuePipe],
  templateUrl: './sort-control.html',
  styleUrl: './sort-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'row gx-0',
  },
})
export class SortControl {
  readonly options = sortOptions;
  readonly value = input<SortOptionKey>('title');
  readonly sortChange = output<SortOptionKey>();

  handleSortChange(value: string) {
    this.sortChange.emit(<SortOptionKey>value);
  }
}
