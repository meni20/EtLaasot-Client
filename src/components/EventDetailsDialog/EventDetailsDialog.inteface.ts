import type { IEvent } from "../../interfaces/event.interface";

export interface IEventDetailsDialogProps {
  open: boolean;
  eventData: IEvent;
  onClose: () => void;
}
