import { useState } from "react";
import { useStyles } from "./Login.styles";
import { useAuth } from "../../../contexts/useAuth";
import { isValidIsraeliId } from "../../../utils/data.utillity";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const LoginPage: React.FC = () => {
  const styles = useStyles();
  const { login } = useAuth();
  const [identifyId, setIdentifyId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!identifyId) {
      setError("יש להזין תעודת זהות");
      return;
    }

    if (!isValidIsraeliId(identifyId)) {
      setError("תעודת הזהות אינה תקינה");
      return;
    }

    if (!password.trim()) {
      setError("יש להזין סיסמה");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(identifyId, password);
    } catch {
      setError("לא הצלחנו להתחבר. בדקו את הפרטים ונסו שוב.");
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
          הזן תעודת זהות וסיסמה
        </Typography>

        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          label="תעודת זהות"
          placeholder="תעודת זהות"
          autoComplete="username"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
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
          label="סיסמה"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "הסתרת סיסמה" : "הצגת סיסמה"}
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!error}
          className={styles.input}
        />
        <Button
          fullWidth
          variant="contained"
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading || !identifyId || !password}
        >
          {loading ? "מתחבר..." : "התחבר"}
        </Button>
      </Box>
    </Box>
  );
};
