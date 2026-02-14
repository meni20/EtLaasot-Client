export interface IEventDetailsDialogProps {
  open: boolean;
  eventData: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    location?: string;
  };
  onClose: () => void;
}
