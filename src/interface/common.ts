import { AxiosResponse } from "axios";

export interface GNestResponse<T> extends AxiosResponse<T> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
}
