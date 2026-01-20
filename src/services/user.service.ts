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

  public getAllVolunteers = async () => {
    return this.api
      .get("get-all-volunteers")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };

  public getAllTreanees = async () => {
    return this.api
      .get("get-all-trainees")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  }

  async createVolunteer(userData: IUser) {
    const res = await this.api.post("/create-volunteer", userData);
    return res.data;
  }

  async createTrainee(userData: IUser) {
    const res = await this.api.post("/create-trainee", userData);
    return res.data;
  }

  public getAllUsers = async () => {
    return this.api
      .get("/get-all")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  };
}

const userService = new UserService();
export default userService;
