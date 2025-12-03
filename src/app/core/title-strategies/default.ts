import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class DefaultTitleStrategy extends TitleStrategy {
  private readonly _title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this._title.setTitle(`${title} | Task Management`);
    }
  }
}
