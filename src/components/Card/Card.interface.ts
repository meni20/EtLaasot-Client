import type { EventAudience } from "../../constants/event-audience.constants";

export interface ICardProps {
  eventId: string;
  audience?: EventAudience;
  branchId?: string;
  eventName: string;
  startDate: Date;
  endDate: Date;
  address: string;
  description?: string;
  eventType?: string;
  imageUrl?: string | null;
  participantsCount?: number;
  onEdit: () => void;
}
