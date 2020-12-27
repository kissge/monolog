declare namespace Sapper {
  import { IncomingMessage, ServerResponse } from 'http';
  import { TLSSocket } from 'tls';

  /**
   * The request object passed to middleware and server-side routes.
   * These fields are common to both Polka and Express, but you are free to
   * instead use the typings that come with the server you use.
   */
  interface SapperRequest<Params = Record<string, string>, Query = Record<string, string>> extends IncomingMessage {
    url: string;
    method: string;
    baseUrl: string;

    /**
     * The originally requested URL, including parent router segments.
     */
    originalUrl: string;

    /**
     * The path portion of the requested URL.
     */
    path: string;

    /**
     * The values of named parameters within your route pattern
     */
    params: Params;

    /**
     * The un-parsed querystring
     */
    search: string | null;

    /**
     * The parsed querystring
     */
    query: Query;

    socket: TLSSocket;
  }

  interface SapperResponse extends ServerResponse {
    locals?: {
      nonce?: string;
      name?: string;
    };
  }

  type ServerRoute<Params = Record<string, string>, Query = Record<string, string>> = (
    req: SapperRequest<Params, Query>,
    res: SapperResponse,
    next: ServerRoute,
  ) => void;
}
