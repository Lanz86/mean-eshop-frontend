import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
  private readonly store = inject(Store);

  currentUser$ = this.store.pipe(select(UsersSelectors.getUser));
  isAuth$ = this.store.pipe(select(UsersSelectors.getUserIsAuth));
  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  buildUserSession() {
    this.store.dispatch(UsersActions.buildUserSession());
  }
}
