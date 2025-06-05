import { create } from 'zustand';

export interface ContactMessage {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  submittedAt: Date;
  isRead: boolean;
}

interface ContactStore {
  messages: ContactMessage[];
  addMessage: (msg: ContactMessage) => void;
  toggleReadStatus: (index: number) => void;
}

export const useContactStore = create<ContactStore>((set) => ({
  messages: [
    {
      firstName: 'เอ้าเห้ย อ่าน',
      lastName: 'ทำไม',
      phone: '0970767568',
      email: 'opeeeeee@gmail.com',
      message: 'เว็บใช้งานง่ายมากเลยค่ะ',
      submittedAt: new Date('2025-06-05T23:31:04'),
    },
    {
      firstName: 'อุฟุฟุวง',
      lastName: 'ง๊วงง่วง',
      phone: '0987654321',
      email: 'wanttosleep@example.com',
      message: 'ผมลืมรหัสผ่านครับ ผมรีบใช้มาก ติดต่อกลับผมด่วนครับ ฮืออ',
      submittedAt: new Date('2025-06-05T10:15:30'),
    },
  ],
  addMessage: (msg) =>
    set((state) => ({
      messages: [msg, ...state.messages],
    })),
  toggleReadStatus: (index) =>
    set((state) => {
      const updated = [...state.messages];
      updated[index].isRead = !updated[index].isRead;
      return { messages: updated };
    }),
}));
