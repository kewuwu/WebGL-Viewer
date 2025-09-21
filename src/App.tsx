import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
  IconButton,
  Stack,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function Viewer() {
  const envUrl = import.meta.env.VITE_WEBGL_URL as string | undefined;

  const safeUrl = useMemo(() => {
    const u = envUrl ? new URL(envUrl, window.location.href) : null;
    if (!u) return "";
    const self =
      u.origin === window.location.origin &&
      (u.pathname === "/" || u.pathname === window.location.pathname);
    return self ? "" : u.toString();
  }, [envUrl]);

  const [reloadSeed] = useState<number>(Date.now());

  const frameSrc = useMemo(() => {
    if (!safeUrl) return "";
    const sep = safeUrl.includes("?") ? "&" : "?";
    return `${safeUrl}${sep}t=${reloadSeed}`;
  }, [safeUrl, reloadSeed]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Card elevation={2} sx={{ overflow: "hidden", borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {safeUrl ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                pt: "62.5%", // 16:10 aspect ratio
                borderRadius: 2,
                overflow: "hidden",
                border: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: "common.black",
              }}
            >
              <Box
                component="iframe"
                title="Unity WebGL Build"
                src={frameSrc}
                allow="fullscreen; autoplay; xr-spatial-tracking"
                allowFullScreen
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  display: "block",
                }}
              />
            </Box>
          ) : (
            <Typography variant="subtitle1" align="center">
              Missing or invalid VITE_WEBGL_URL
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Description under the game */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Pathfinding Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This Unity WebGL project demonstrates a custom <strong>A* pathfinding
          algorithm</strong> running on a dynamic tilemap with varied terrain costs.
          It highlights efficient traversal while respecting movement restrictions
          such as diagonal corner-cutting. 
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Built with Unity (WebGL export), hosted on AWS S3 + CloudFront, and
          wrapped in a Vite + React + MUI frontend.
        </Typography>
      </Box>
    </Container>
  );
}

export default function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [dark, setDark] = useState(prefersDark);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: dark ? "dark" : "light" },
        shape: { borderRadius: 14 },
        typography: { fontSize: 14 },
      }),
    [dark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Unity WebGL Viewer
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Pathfinding Algorithm Demo
            </Typography>
          </Stack>
          <IconButton onClick={() => setDark((d) => !d)} color="inherit">
            {dark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Viewer />

      {/* Footer with credits */}
      <Box component="footer" sx={{ py: 4, textAlign: "center", mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} — Developed by <strong>Kevin</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Unity • AWS CloudFront/S3 • React + Vite + MUI • A* Pathfinding
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
