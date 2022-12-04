import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export interface HTTPClientOptions {
  baseURL: string;
  authToken?: string;
  onError(error: AxiosError): void;
  responseDataMapper<T>(res: AxiosResponse<unknown>): T;
}

export class HTTPClient<Options extends HTTPClientOptions = HTTPClientOptions> {
  private client: AxiosInstance;

  constructor(protected options: Options) {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (options.authToken) {
      headers.Authorization = `Bearer ${options.authToken}`;
    }

    this.client = Axios.create({
      baseURL: options.baseURL,
      headers,
      responseType: 'json',
    });
  }

  public get = <T>(url: string, params?: unknown): Promise<T> =>
    this.client
      .get(url, { params })
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch(this.options.onError) as Promise<T>;

  public post = <T>(
    url: string,
    data?: unknown,
    params?: unknown,
  ): Promise<T> =>
    this.client
      .post(url, data, { params })
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch(this.options.onError) as Promise<T>;

  public put = <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    this.client
      .put(url, data, config)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch(this.options.onError) as Promise<T>;

  public delete = <T>(url: string): Promise<T> =>
    this.client
      .delete(url)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch(this.options.onError) as Promise<T>;
}
