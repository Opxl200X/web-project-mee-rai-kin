import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bmr?: number;
  tdee?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

// This is a mock implementation for demonstration
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email, password) => {
    // For demo purposes, we're simulating a successful login
    // In a real app, you would make an API call here
    
    // Simple validation
    if (!email || !password) return false;
    
    const mockUser = {
      id: '1',
      username: 'DemoUser',
      email: email,
      profileImage: 'https://digitalmore.co/wp-content/uploads/2025/02/Cartoon-Profile-Pictures-02.jpg'
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    set({ isAuthenticated: true, user: mockUser });
    return true;
  },
  
  register: async (username, email, password) => {
    // For demo purposes, we're simulating a successful registration
    // In a real app, you would make an API call here
    
    // Simple validation
    if (!username || !email || !password) return false;
    
    const mockUser = {
      id: '1',
      username,
      email,
      profileImage: 'https://digitalmore.co/wp-content/uploads/2025/02/Cartoon-Profile-Pictures-02.jpg'
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    set({ isAuthenticated: true, user: mockUser });
    return true;
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
  
  checkAuth: () => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        set({ isAuthenticated: true, user });
      } catch (e) {
        localStorage.removeItem('user');
        set({ isAuthenticated: false, user: null });
      }
    }
  },
  
  updateProfile: (userData) => {
    set(state => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    });
  }
}));