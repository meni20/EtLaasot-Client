export interface IEventAtendeeDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  onDelete: (id: string) => void;
}