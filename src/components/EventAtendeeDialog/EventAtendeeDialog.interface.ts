export interface IEventAtendeeDialogProps {
  open: boolean;
  onClose: () => void;
  atendees: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  onDelete: (id: string) => void;
}