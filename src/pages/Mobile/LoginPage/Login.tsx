import { useState } from "react";
import { useStyles } from "./Login.styles";
import { useAuth } from "../../../contexts/useAuth";
import { isValidIsraeliId } from "../../../utils/data.utillity";
import { Box, Button, TextField, Typography } from "@mui/material";

export const LoginPage: React.FC = () => {
  const styles = useStyles();
  const { login } = useAuth();
  const [identifyId, setIdentifyId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!identifyId) {
      setError("ID is required");
      return;
    }

    if (!isValidIsraeliId(identifyId)) {
      setError("Invalid Israeli ID");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(identifyId);
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Typography className={styles.logo}>🤝</Typography>
        <Typography className={styles.title}>עת לעשות</Typography>
        <Typography className={styles.subtitle}>
          הזן תעודת זהות כדי להתחבר
        </Typography>

        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          placeholder="תעודת זהות"
          value={identifyId}
          onChange={(e) => {
            setIdentifyId(e.target.value.replace(/\D/g, "")); // numbers only
            setError("");
          }}
          error={!!error}
          helperText={error}
          className={styles.input}
        />
        <Button
          fullWidth
          variant="contained"
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading || !identifyId}
        >
          {loading ? "מתחבר..." : "התחבר"}
        </Button>
      </Box>
    </Box>
  );
};
