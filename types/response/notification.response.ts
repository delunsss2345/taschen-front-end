export type NotificationResponse = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
};
