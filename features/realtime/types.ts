export interface WsEvent {
  type: "CREATED" | "UPDATED" | "DELETED";
  entity: string;
  id: number;
  data: unknown | null;
}
