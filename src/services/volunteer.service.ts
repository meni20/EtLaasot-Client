import axios from "axios";
import type { AxiosInstance } from "axios";
import type { IVolunteer } from "../interfaces/volunteer.interface";


export class VolunteerService {
    private api: AxiosInstance;
    constructor(){
        this.api = axios.create({baseURL: "http://localhost:3001/volunteer", withCredentials: true})
    }

    public getAllVolunteers = async () => {
        return this.api
            .get('get-all-volunteers')
            .then(res => res.data)
            .catch((err) => {
                console.log(err);
            })
    }

    async createVolunteer(volunteerData: IVolunteer) {
        console.log("sending:", volunteerData);
        const res = await this.api.post("/create", volunteerData);
        console.log(res);
        
        return res.data;
      }
}

const volunteerService = new VolunteerService()
export default volunteerService