import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, finalize, Observable, of, tap } from "rxjs";
import { map } from "rxjs/operators";
import { ApiBaseService } from "@core/services/api-base.service";
import { AuthTokenStorageService } from "@core/services/auth-token-storage.service";
import { EnvironmentInterface } from "@core/interfaces/environment.interface";
import { ENV } from "@core/tokens/environment.token";

interface LoginRequestInterface {
  username: string;
  password: string;
}

export interface AuthRefreshResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService extends ApiBaseService {
  private http: HttpClient = inject(HttpClient);
  private authTokenStorageService: AuthTokenStorageService = inject(AuthTokenStorageService);
  private env = inject<EnvironmentInterface>(ENV);

  private token: string | null = null;
  private refreshToken: string | null = null;

  public login(user: LoginRequestInterface): Observable<any> {
    return this.http.post<{ username: string; password: string }>(`${this.env.server_url}/auth/signin`, user).pipe(
      tap((res: any) => {
        this.saveToken(res);
      }),
      map(() => this.getUser()),
    );
  }

  public logout(): Observable<any> {
    return this.http.post(`${this.env.server_url}/auth/signout`, null).pipe(
      tap(() => {
        this.token = null;
        this.refreshToken = null;
        this.authTokenStorageService.logOut();
      }),
    );
  }

  public refreshAccessToken(): Observable<AuthRefreshResponse> {
    return this.http.post<AuthRefreshResponse>(`${this.env.server_url}/auth/refresh_token`, { refresh_token: this.refreshToken }).pipe(
      tap((res: AuthRefreshResponse) => this.saveToken(res)),
      catchError((err) => {
        this.token = null;
        this.authTokenStorageService.logOut();
        return this.handleError(err, {});
      }),
      finalize(() => of([])),
    );
  }

  public init(): Observable<boolean> {
    return of(this.isAuth);
  }

  public getUser(): any {
    const decodedToken = this.authTokenStorageService.decodeToken();
    return { username: decodedToken.username, role: decodedToken.role };
  }

  public get isAuth(): boolean {
    if (!this.token) {
      this.token = this.authTokenStorageService.getToken("access_token");
    }
    return !!this.token;
  }

  public userUpdate(credentials: any): Observable<any> {
    return of([]);
  }

  public saveToken(res: AuthRefreshResponse): void {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;
    this.authTokenStorageService.setToken(this.token);
    this.authTokenStorageService.refreshToken(this.refreshToken);
  }
}
