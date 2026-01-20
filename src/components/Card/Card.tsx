import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { ICardProps } from "./Card.interface";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { formatDate } from "../../utils/data.utillity";
import { Box } from "@mui/material";
import { useState } from "react";
import { EventAtendeeDialog } from "../EventAtendeeDialog/EventAtendeeDialog";

export const BasicCard: React.FC<ICardProps> = ({
  eventName,
  eventDate,
  address,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const atendees = [
    { id: "1", name: "יוסי כהן", email: "yossi@example.com" },
    { id: "2", name: "שרה לוי", email: "sara@example.com" },
    { id: "3", name: "דוד מזרחי", email: "david@example.com" },
    { id: "4", name: "רונית ישראלי", email: "ronit@example.com" },
    { id: "5", name: "משה פרץ", email: "moshe@example.com" },
    { id: "6", name: "מיכל כהן", email: "michal@example.com" },
    { id: "7", name: "אבי לוי", email: "avi@example.com" },
  ];

  return (
    <Box
      sx={{
        width: 280,
        m: 2,
        display: "inline-block",
        verticalAlign: "top",
      }}
    >
      <Card
        sx={{
          minWidth: 250,
          borderRadius: 3,
          boxShadow: 4,
          direction: "rtl",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            {eventName}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mb: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📅 {formatDate(eventDate)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: 15 }}
          >
            📍 {address}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={() => setOpen(true)}
          >
            הצג משתתפים
          </Button>
        </CardActions>
      </Card>

      {open && (
        <EventAtendeeDialog
          open={open}
          onClose={() => setOpen(false)}
          atendees={atendees}
          onDelete={() => {}}
        />
      )}
    </Box>
  );
};
