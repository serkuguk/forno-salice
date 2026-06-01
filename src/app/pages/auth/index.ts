import {User} from "@core/models/backend/user";

export interface State {
  user: User | null;
  access_token: string | null;
  loading: boolean | null;
  error: string | null;
}
