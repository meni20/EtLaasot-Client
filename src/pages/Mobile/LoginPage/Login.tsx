import { useState } from "react";
import { useStyles } from "./Login.styles";
import { useAuth } from "../../../contexts/useAuth";
import { isValidIsraeliId } from "../../../utils/data.utillity";
import { Box, Button, TextField, Typography } from "@mui/material";

export const LoginPage: React.FC = () => {
  const styles = useStyles();
  const { login } = useAuth();
  const [identifyId, setIdentifyId] = useState<string>("");
  const [loginCode, setLoginCode] = useState<string>("");
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

    if (!loginCode.trim()) {
      setError("Login code is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(identifyId, loginCode);
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Box
          component="img"
          src="/etlaasot-favicon.png"
          alt="עת לעשות"
          className={styles.logo}
        />
        <Typography className={styles.subtitle}>
          הזן תעודת זהות וקוד התחברות
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
        <TextField
          fullWidth
          variant="outlined"
          placeholder="קוד התחברות"
          value={loginCode}
          onChange={(e) => {
            setLoginCode(e.target.value);
            setError("");
          }}
          type="password"
          error={!!error}
          className={styles.input}
        />
        <Button
          fullWidth
          variant="contained"
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading || !identifyId || !loginCode}
        >
          {loading ? "מתחבר..." : "התחבר"}
        </Button>
      </Box>
    </Box>
  );
};
