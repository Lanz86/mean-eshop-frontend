import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const buildUserSession = createAction('[Users] Build User Session');

export const buildUserSessionSuccess = createAction(
  '[Users] Build User Session Success',
  props<{ user: User }>()
);

export const buildUserSessionFaid = createAction('[Users] Build User Session Failed');

// export const initUsers = createAction('[Users Page] Init');

// export const loadUsersSuccess = createAction(
//   '[Users/API] Load Users Success',
//   props<{ users: UsersEntity[] }>()
// );

// export const loadUsersFailure = createAction(
//   '[Users/API] Load Users Failure',
//   props<{ error: any }>()
// );
