import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

export interface CompletedSignature {
  image: string;
  signedAt: string;
}
export function SignaturePad({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: CompletedSignature;
  onChange: (value?: CompletedSignature) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const segments = useRef(0);
  const [ink, setInk] = useState(false);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      element.width = Math.round(rect.width * scale);
      element.height = Math.round(rect.height * scale);
      const ctx = element.getContext("2d");
      ctx?.scale(scale, scale);
      if (ctx) {
        ctx.lineWidth = 2.3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#303050";
      }
      drawing.current = false;
      segments.current = 0;
      setInk(false);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);
  const clear = () => {
    const element = canvas.current;
    if (element)
      element.getContext("2d")?.clearRect(0, 0, element.width, element.height);
    drawing.current = false;
    segments.current = 0;
    setInk(false);
    onChange(undefined);
  };
  return (
    <Stack gap={2}>
      <Typography fontWeight={700}>{label}</Typography>
      {value ? (
        <Box
          component="img"
          src={value.image}
          alt={`חתימה שהושלמה — ${label}`}
          sx={{
            width: "100%",
            height: 150,
            objectFit: "contain",
            border: "1px solid #D9BFD2",
            borderRadius: 2,
          }}
        />
      ) : (
        <Box
          component="canvas"
          ref={canvas}
          aria-label={`משטח חתימה ${label}`}
          role="img"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Escape") clear();
          }}
          sx={{
            display: "block",
            width: "100%",
            height: 150,
            touchAction: "none",
            bgcolor: "#FCFAFC",
            border: "1px dashed #7A3E6B",
            borderRadius: 2,
          }}
          onPointerDown={(e) => {
            if (!e.isPrimary) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            const r = e.currentTarget.getBoundingClientRect();
            const ctx = e.currentTarget.getContext("2d");
            ctx?.beginPath();
            ctx?.moveTo(e.clientX - r.left, e.clientY - r.top);
            drawing.current = true;
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const r = e.currentTarget.getBoundingClientRect();
            const ctx = e.currentTarget.getContext("2d");
            ctx?.lineTo(e.clientX - r.left, e.clientY - r.top);
            ctx?.stroke();
            segments.current++;
          }}
          onPointerUp={(e) => {
            drawing.current = false;
            setInk(segments.current > 2);
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={clear}
        />
      )}
      <Typography variant="body2" color="text.secondary">
        {value
          ? `החתימה הושלמה ב־${new Date(value.signedAt).toLocaleString("he-IL")}. נשמרת בזיכרון מסך זה בלבד.`
          : "חתמו באמצעות האצבע או העכבר, ואז לחצו על ״סיום חתימה״. ציור חלקי אינו נשמר."}
      </Typography>
      <Stack direction="row" gap={2}>
        {!value && (
          <Button
            variant="outlined"
            disabled={!ink}
            onClick={() => {
              if (canvas.current && !drawing.current)
                onChange({
                  image: canvas.current.toDataURL("image/png"),
                  signedAt: new Date().toISOString(),
                });
            }}
          >
            סיום חתימה
          </Button>
        )}
        <Button onClick={clear}>ניקוי וחתימה מחדש</Button>
      </Stack>
    </Stack>
  );
}
