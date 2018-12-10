
export interface LoginResponse {
    result? : {
      email?: string;
      uid?: string;
    //   password? :string;
    }
    error?: {
      code?: string;
      message?: string;
    }
  }