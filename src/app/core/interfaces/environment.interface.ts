export interface EnvironmentInterface {
  production: boolean;
  token_header_key: string;
  server_url: string;
  jwtAllowedDomains?: string[];
}
