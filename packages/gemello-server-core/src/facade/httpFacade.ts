import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
export type Class<T> = { new (): T };

class HttpRequestBuilder<T extends object> {
  private validateCallback: (value: T) => Promise<ValidationError[]>;
  private errorCallback: (errors: ValidationError[]) => void | Promise<void>;
  protected axiosRequestConfig: AxiosRequestConfig;

  constructor(url: string, method: HttpMethod) {
    this.axiosRequestConfig = { url, method, headers: new AxiosHeaders() };
    this.validateCallback = async () => [];
  }

  public setToken(token: string) {
    (this.axiosRequestConfig.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${token}`
    );
    return this;
  }

  public validateResponse(C: Class<T>) {
    this.validateCallback = (value: T) => {
      const valueToClass = plainToClass(C, value);
      return validate(valueToClass);
    };
    return this;
  }

  public validationErrorCallback(
    cb: (errors: ValidationError[]) => void | Promise<void>
  ) {
    this.errorCallback = cb;
    return this;
  }

  public async execute() {
    const { data } = await axios(this.axiosRequestConfig);
    const errors = await this.validateCallback(data);
    await this.errorCallback(errors);

    return data;
  }
}

class GetRequestBuilder<
  ResposneData extends object,
> extends HttpRequestBuilder<ResposneData> {
  constructor(url: string) {
    super(url, "get");
  }
}

class DeleteRequestBuilder<
  ResposneData extends object,
> extends HttpRequestBuilder<ResposneData> {
  constructor(url: string) {
    super(url, "delete");
  }
}

class PostableRequestBuilder<
  ResposneData extends object,
  RequestBody,
> extends HttpRequestBuilder<ResposneData> {
  constructor(url: string, method: HttpMethod) {
    super(url, method);
  }

  public setData(body: RequestBody) {
    this.axiosRequestConfig.data = body;
    return this;
  }
}

class PostRequestBuilder<
  ResposneData extends object,
  RequestBody,
> extends PostableRequestBuilder<ResposneData, RequestBody> {
  constructor(url: string) {
    super(url, "post");
  }
}

class PutRequestBuilder<
  ResposneData extends object,
  RequestBody,
> extends PostableRequestBuilder<ResposneData, RequestBody> {
  constructor(url: string) {
    super(url, "get");
  }
}

class PatchRequestBuilder<
  ResposneData extends object,
  RequestBody,
> extends PostableRequestBuilder<ResposneData, RequestBody> {
  constructor(url: string) {
    super(url, "get");
  }
}

export type EndpointUrl = `/${string}`;
export type BaseUrl = `${string}/api`;

export class HttpFacade {
  constructor(private readonly baseUrl: BaseUrl) {}
  public get(url: EndpointUrl) {
    return new GetRequestBuilder(`${this.baseUrl}${url}`);
  }

  public post(url: EndpointUrl) {
    return new PostRequestBuilder(`${this.baseUrl}${url}`);
  }

  public put(url: EndpointUrl) {
    return new PutRequestBuilder(`${this.baseUrl}${url}`);
  }

  public patch(url: EndpointUrl) {
    return new PatchRequestBuilder(`${this.baseUrl}${url}`);
  }

  public delete(url: EndpointUrl) {
    return new DeleteRequestBuilder(`${this.baseUrl}${url}`);
  }
}
