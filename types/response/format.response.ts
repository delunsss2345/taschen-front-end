import type { BackendApiResponse } from "./book.response";

export type Format = {
  id: number;
  formatCode: string;
  formatName: string;
};

export type FormatListData = Format[];

export type FormatApiResponse = BackendApiResponse<FormatListData>;
