interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  /**
   * Built-in environment variable.
   * @see Docs https://github.com/chihab/ngx-env#ng_app_env.
   */
  readonly NG_APP_ENV: string;
  readonly NG_APP_PRODUCTION: boolean;
  readonly NG_APP_API_URL: string;
  readonly NG_APP_TOKEN_ENDPOINT: string;
  readonly NG_APP_CLIENT_ID: string;
  readonly NG_APP_CLIENT_SECRET: string;
  // Add your environment variables below
  // readonly NG_APP_API_URL: string;

  /* [key: string]: any; */
}
