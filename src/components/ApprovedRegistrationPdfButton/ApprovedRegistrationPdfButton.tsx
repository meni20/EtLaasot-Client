import { IconButton, Tooltip, Typography } from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import type { IUser } from "../../interfaces/user.interface";

interface ApprovedRegistrationPdfButtonProps {
  reference: IUser["parentRegistrationPdf"];
  name: string;
  tabIndex: number;
}

export function ApprovedRegistrationPdfButton({
  reference,
  name,
  tabIndex,
}: ApprovedRegistrationPdfButtonProps) {
  if (!reference) {
    return (
      <Tooltip title="אין PDF מאושר">
        <Typography
          component="span"
          color="text.secondary"
          aria-label="אין PDF מאושר"
        >
          —
        </Typography>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="פתיחת טופס רישום מאושר בחלון חדש">
      <IconButton
        size="small"
        tabIndex={tabIndex}
        aria-label={`פתיחת טופס רישום מאושר של ${name} בחלון חדש`}
        onClick={(event) => {
          event.stopPropagation();
          const url = new URL("/registration-pdf", window.location.origin);
          url.searchParams.set("source", reference.source);
          url.searchParams.set("formId", reference.formId);
          url.searchParams.set("documentId", reference.documentId);
          const pdfTab = window.open(url.toString(), "_blank");
          if (!pdfTab) {
            window.alert(
              "הדפדפן חסם את פתיחת ה-PDF. יש לאפשר חלונות קופצים ולנסות שוב.",
            );
            return;
          }
          pdfTab.opener = null;
        }}
        sx={{ minWidth: 44, minHeight: 44, color: "primary.dark" }}
      >
        <PictureAsPdfOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
