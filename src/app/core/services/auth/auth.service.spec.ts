import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { EnvironmentInterface } from "@core/interfaces/environment.interface";
import { AuthTokenStorageService } from "@core/services/auth-token-storage.service";
import { ENV } from "@core/tokens/environment.token";
import { AuthService } from "./auth.service";

interface LoginRequestInterface {
  username: string;
  password: string;
}

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storage: jest.Mocked<AuthTokenStorageService>;
  const env: EnvironmentInterface = {
    production: false,
    token_header_key: "Authorization",
    server_url: "http://api.test",
  };

  beforeEach(() => {
    storage = {
      setToken: jest.fn(),
      refreshToken: jest.fn(),
      getToken: jest.fn(),
      decodeToken: jest.fn(),
      logOut: jest.fn(),
      isAuthenticate: jest.fn(),
    } as unknown as jest.Mocked<AuthTokenStorageService>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ENV, useValue: env },
        { provide: AuthTokenStorageService, useValue: storage },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("logs in and stores tokens, returning decoded user", (done) => {
    const credentials: LoginRequestInterface = { username: "demo", password: "secret" };
    storage.decodeToken.mockReturnValue({ username: "demo", role: "admin" });

    service.login(credentials).subscribe((user) => {
      expect(user).toEqual({ username: "demo", role: "admin" });
      expect(storage.setToken).toHaveBeenCalledWith("access");
      expect(storage.refreshToken).toHaveBeenCalledWith("refresh");
      done();
    });

    const req = httpMock.expectOne(`${env.server_url}/auth/signin`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(credentials);
    req.flush({ access_token: "access", refresh_token: "refresh" });
  });

  it("logs out, clears tokens, and calls storage logout", (done) => {
    (service as any).saveToken({ access_token: "old", refresh_token: "old-refresh" });

    service.logout().subscribe(() => {
      expect(storage.logOut).toHaveBeenCalled();
      expect((service as any).token).toBeNull();
      expect((service as any).refreshToken).toBeNull();
      done();
    });

    const req = httpMock.expectOne(`${env.server_url}/auth/signout`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toBeNull();
    req.flush({});
  });

  it("refreshes access token and saves new credentials", () => {
    (service as any).saveToken({ access_token: "old", refresh_token: "stored-refresh" });
    jest.clearAllMocks();

    service.refreshAccessToken().subscribe();

    const req = httpMock.expectOne(`${env.server_url}/auth/refresh_token`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ refresh_token: "stored-refresh" });

    req.flush({ access_token: "new-access", refresh_token: "new-refresh" });
    expect(storage.setToken).toHaveBeenCalledWith("new-access");
    expect(storage.refreshToken).toHaveBeenCalledWith("new-refresh");
    expect((service as any).token).toBe("new-access");
  });

  it("handles refresh token errors by clearing state and rethrowing", (done) => {
    (service as any).saveToken({ access_token: "old", refresh_token: "bad-refresh" });
    jest.clearAllMocks();

    service.refreshAccessToken().subscribe({
      next: () => done.fail("expected error"),
      error: () => {
        expect(storage.logOut).toHaveBeenCalled();
        expect((service as any).token).toBeNull();
        done();
      },
    });

    const req = httpMock.expectOne(`${env.server_url}/auth/refresh_token`);
    req.flush("unauthorized", { status: 401, statusText: "Unauthorized" });
  });
});
