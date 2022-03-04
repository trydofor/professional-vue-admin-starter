// noinspection AllyPlainJsInspection

/**
 * @file 使用`wings`约定，把axios包装为常用的client
 * @author trydofor
 * @since 2021-09-06
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig as RequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import { saveFile } from '@/libs/save-file';
import { ciGet } from '@/libs/objects';

/**
 * 常用的content-type类型
 */
export const enum ContentType {
  FORM = 'application/x-www-form-urlencoded',
  JSON = 'application/json; charset=utf-8',
  FILE = 'multipart/form-data',
}

/**
 * 常用的错误拦截点，checker是request之前
 */
export const enum EjectType {
  Checker = 'checker',
  Request = 'request',
  Response = 'response',
}

export interface AxiosRequestConfig extends RequestConfig {
  /**
   * 判断连击的毫秒数，小于等于0为不做检查
   */
  duplicateInterval?: number;
  /**
   * 若是blob类型，应答中是json格式，是否认为失败
   */
  blobFailedIfJson?: boolean;
}

/**
 * 扩展的配置项
 */
export interface AxiosClientConfig extends AxiosRequestConfig {
  /**
   * 拦截request
   * @param config 当前请求的config
   */
  interceptRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  /**
   * 拦截response，在interceptNeedLogin之后执行
   * @param response 成功的response
   */
  interceptResponse?: (response: AxiosResponse) => AxiosResponse;

  /**
   * 处理checker，request和response的错误情况(reject)
   * @param error 错误
   * @param eject 拦截点
   */
  interceptRejected?: (error: AxiosError, eject: EjectType) => unknown;
}

/**
 * 使用`wings`约定，把axios包装为常用的client
 */
export class AxiosClient {
  private readonly defaultConfig: AxiosClientConfig;
  private lastRequestTimestamp = -1;
  private lastRequestIdentity = '';
  public axiosInstance: AxiosInstance;

  constructor(config: AxiosClientConfig) {
    this.defaultConfig = config;
    this.axiosInstance = this.create(config);
  }

  public request<R>(conf: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    const options: AxiosClientConfig = Object.assign({}, this.defaultConfig, conf);
    if (this.isDoubleClick(conf)) {
      const err: AxiosError = Object.assign(new Error('duplicate request with same data'), {
        config: options as AxiosRequestConfig,
        isAxiosError: false,
        code: 'check-duplicate',
        toJSON: () => {
          return {
            success: false,
            message: 'duplicate request with same data',
          };
        },
      });
      options.interceptRejected?.(err, EjectType.Checker);
      return Promise.reject(err);
    }

    return this.axiosInstance.request(options);
  }

  public getJson<R>(url: string, data?: unknown, conf?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    const options: AxiosClientConfig = Object.assign(
      {
        method: 'get',
        headers: { 'Content-Type': ContentType.JSON },
      },
      conf,
    );
    if (url) options.url = url;
    if (data) options.params = data;
    return this.request(options);
  }

  public postJson<R>(url: string, data?: unknown, conf?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    const options: AxiosClientConfig = Object.assign(
      {
        method: 'post',
        headers: { 'Content-Type': ContentType.JSON },
      },
      conf,
    );
    if (url) options.url = url;
    if (data) options.data = data;
    return this.request(options);
  }

  public postForm<R>(url: string, data?: unknown, conf?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    const options: AxiosClientConfig = Object.assign(
      {
        method: 'post',
        headers: { 'Content-Type': ContentType.FORM },
      },
      conf,
    );
    if (url) options.url = url;
    if (data) options.data = qs.stringify(data, { indices: false });
    return this.request(options);
  }

  public async dataJson<T>(url: string, data?: unknown, conf?: AxiosRequestConfig): Promise<T> {
    const response = await this.postJson(url, data, conf);
    return response.data as T;
  }

  public async dataForm<T>(url: string, data?: unknown, conf?: AxiosRequestConfig): Promise<T> {
    const response = await this.postForm(url, data, conf);
    return response.data as T;
  }

  public handJson<T>(url: string, doData: (data: T) => void, data?: unknown, conf?: AxiosRequestConfig): void {
    this.postJson(url, data, conf).then(it => doData(it.data as T));
  }

  public handForm<T>(url: string, doData: (data: T) => void, data?: unknown, config?: AxiosRequestConfig): void {
    this.postForm(url, data, config).then(it => doData(it.data as T));
  }

  public blobJson<T>(url: string, doData: (data: Blob | T) => void, data?: unknown, conf?: AxiosRequestConfig): void {
    this.postJson(url, data, Object.assign({ responseType: 'blob' }, conf)).then(it => {
      this.dealBlobJson(it, doData);
    });
  }

  public blobForm<T>(url: string, doData: (data: Blob | T) => void, data?: unknown, conf?: AxiosRequestConfig): void {
    this.postForm(url, data, Object.assign({ responseType: 'blob' }, conf)).then(it => {
      this.dealBlobJson(it, doData);
    });
  }

  public fileJson(url: string, data?: unknown, name?: string, conf?: AxiosRequestConfig): void {
    this.postJson(url, data, Object.assign({ responseType: 'blob', blobFailedIfJson: true }, conf)).then(it => {
      const blob = it.data as Blob;
      if (blob != null) {
        saveFile(blob, this.getFileName(it, name) || 'download.blob');
      }
    });
  }

  public fileForm(url: string, data?: unknown, name?: string, conf?: AxiosRequestConfig): void {
    this.postForm(url, data, Object.assign({ responseType: 'blob', blobFailedIfJson: true }, conf)).then(it => {
      const blob = it.data as Blob;
      if (blob != null) {
        saveFile(blob, this.getFileName(it, name) || 'download.blob');
      }
    });
  }

  public async getBlob(url: string, para?: unknown): Promise<Blob> {
    const response = await this.request<Blob>({
      url: url,
      method: 'get',
      responseType: 'blob',
      params: para,
      duplicateInterval: 0,
      blobFailedIfJson: true,
    });
    return response.data;
  }

  public downloadFile(url: string, name?: string, para?: unknown): void {
    this.getBlob(url, para).then(it => {
      saveFile(it, name || 'download');
    });
  }

  public async getBlobUrl(url: string, para?: unknown): Promise<string> {
    const blob = await this.getBlob(url, para);
    return URL.createObjectURL(blob);
  }

  // //////////

  private dealBlobJson<T>(res: AxiosResponse<unknown>, doData: (data: Blob | T) => void): void {
    const blob = res.data as Blob;
    const ct = ciGet<string>(res.headers, 'content-type', '');
    // failed
    if (ct && ct.includes('json')) {
      blob.text().then(b => {
        const json = JSON.parse(b);
        doData(json as T);
      });
    } else {
      doData(blob);
    }
  }

  // noinspection JSMethodCanBeStatic
  private getFileName(res: AxiosResponse<unknown>, name?: string): string | undefined {
    // Content-Disposition: attachment;fileName="ä¸»å•æ˜Žç»†è¡¨.xlsx"
    const fn = ciGet<string>(res.headers, 'content-disposition', '');
    if (fn) {
      const p0 = fn.indexOf('fileName=');
      if (p0 > 0) {
        const p1 = fn.indexOf('"', p0 + 9);
        const p2 = fn.lastIndexOf('"');
        if (p1 > p0 && p1 < p2) {
          const nm = fn.substring(p1, p2);
          return decodeURIComponent(escape(nm));
        }
      }
    }

    return name;
  }

  private create(conf: AxiosClientConfig): AxiosInstance {
    if (conf.duplicateInterval && conf.duplicateInterval > 0) {
      this.lastRequestTimestamp = Date.now();
    }

    const instance = axios.create(conf);

    if (conf.interceptRequest) {
      if (this.rejectHandler) {
        instance.interceptors.request.use(conf.interceptRequest, this.rejectHandler(conf, EjectType.Request));
      } else {
        instance.interceptors.request.use(conf.interceptRequest);
      }
    } else {
      if (this.rejectHandler) {
        instance.interceptors.request.use(cnf => cnf, this.rejectHandler(conf, EjectType.Request));
      }
    }

    if (conf.interceptResponse) {
      if (this.rejectHandler) {
        instance.interceptors.response.use(conf.interceptResponse, this.rejectHandler(conf, EjectType.Response));
      } else {
        instance.interceptors.response.use(conf.interceptResponse);
      }
    } else {
      if (this.rejectHandler) {
        instance.interceptors.response.use(cnf => cnf, this.rejectHandler(conf, EjectType.Request));
      }
    }
    return instance;
  }

  private isDoubleClick(conf: AxiosRequestConfig): boolean {
    if (this.lastRequestTimestamp <= 0 || !conf.duplicateInterval || conf.duplicateInterval <= 0) return false;

    const id = JSON.stringify({
      method: conf.method,
      url: conf.url,
      params: conf.params,
      data: conf.data,
    });
    const tm = Date.now();
    if (id === this.lastRequestIdentity && tm < conf.duplicateInterval + this.lastRequestTimestamp) {
      return true;
    } else {
      this.lastRequestIdentity = id;
      this.lastRequestTimestamp = tm;
    }
    return false;
  }

  private rejectHandler(conf: AxiosClientConfig, eject: EjectType) {
    return (error: AxiosError) => {
      const rt = conf.interceptRejected?.(error, eject);
      return rt ? rt : Promise.reject(error);
    };
  }
}
