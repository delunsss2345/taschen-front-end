import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080/ws";

export function createStompClient(): Client {
  return new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 25000,
    heartbeatOutgoing: 25000,
  });
}
