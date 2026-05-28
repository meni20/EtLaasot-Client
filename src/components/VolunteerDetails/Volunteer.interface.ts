import type { IUser } from "../../interfaces/user.interface";

export interface IVolunteerDetailsProps {
    open: boolean;
    onClose: () => void;
    volunteerData: IUser;
    entityLabel?: string;
}
