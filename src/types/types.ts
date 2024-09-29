interface BoardResponse {
  id: string;
  title: string;
  description: string;
  members: string[];
}

interface UserModel extends Document {
  username: string;
  email: string;
  password: string;
  boards: string[];
}

export { BoardResponse, UserModel };
