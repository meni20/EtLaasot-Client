
export interface ICardProps {
    eventId: string;
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
