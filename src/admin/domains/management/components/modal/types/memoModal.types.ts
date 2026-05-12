export interface MemoModalTarget {
  uid: number;
  name: string;
  course: number;
}

export interface GroupMemo {
  id: number;
  content: string;
  createdAt: string;
  grantedUser: string;
}
