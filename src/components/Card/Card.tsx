import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { ICardProps } from './Card.interface';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { formatDate } from '../../utils/data.utillity';

export const  BasicCard: React.FC<ICardProps> = ({eventName, eventDate, address}) => {
  return (
    <Card sx={{ minWidth: 200, direction: 'rtl' }}>
      <CardContent>
        <Typography variant="h5" component="div">
            {eventName}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{formatDate(eventDate)}</Typography>
        <Typography variant="body2">
            {address}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">הצג משתתפים</Button>
      </CardActions>
    </Card>
  );
}