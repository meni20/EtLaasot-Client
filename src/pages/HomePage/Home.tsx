import { BasicCard } from "../../components/Card/Card";
import { CreateVolunteer } from "../../components/CreateVolunteerPopup/CreateVolunteer";

export const HomePage: React.FC = () => {
  return (
    <div>
      <BasicCard eventName="שבת צור הדסה" eventDate={new Date()} address="צור הדסה"/>
    </div>
  );
};
