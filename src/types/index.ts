interface DBObject {
  createdAt?: string;
  updatedAt?: string;
  id: string;
}

export interface User extends DBObject {
  username: string;
}

export interface Room extends DBObject {
  name: string;
}

export interface Chat extends DBObject {
  message: string;
  sender: User;
  sentAt: string;
  room?: Room;
  deliveredAt?: string;
}
