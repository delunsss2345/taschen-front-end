import type { BaseResponse } from "./base.response";

export type Format = {
  id: number;
  formatCode: string;
  formatName: string;
};

export type FormatListData = Format[];

export type FormatApiResponse = BaseResponse<FormatListData>;
