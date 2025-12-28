import axios from "axios";
import type { AxiosInstance } from "axios";
import type { IUser } from "../interfaces/user.interface";

export class UserService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:3000/user",
    });
  }

  public getAllUsers = async () => {
    return this.api
      .get("get-all-users")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };

  async createUser(userData: IUser) {
    console.log("sending:", userData);
    const res = await this.api.post("/create", userData);
    console.log(res);

    return res.data;
  }
}

const userService = new UserService();
export default userService;
