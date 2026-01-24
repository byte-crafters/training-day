import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#00E5FF",
            dark: "#00B8CC",
            light: "#00E5FF",
            contrastText: "#000000",
        },
        secondary: {
            main: "#00E5FF",
            dark: "#00B8CC",
        },
        background: {
            default: "#0A0A0A",
            paper: "#161618",
        },
        text: {
            primary: "#ffffff",
            secondary: "#a1a1aa", // zinc-400
            disabled: "#71717a", // zinc-500
        },
        divider: "rgba(255, 255, 255, 0.05)",
        action: {
            active: "#00E5FF",
            hover: "rgba(255, 255, 255, 0.1)",
            selected: "rgba(0, 229, 255, 0.1)",
            disabled: "rgba(255, 255, 255, 0.3)",
            disabledBackground: "rgba(255, 255, 255, 0.05)",
        },
        error: {
            main: "#2B1A1C"
        },
        warning: {
            main: "#f59e0b",
        },
        info: {
            main: "rgb(58, 58, 58)",
        },
        success: {
            main: "#10b981",
        },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        h1: {
            fontSize: "1rem", // text-4xl
            fontWeight: 900, // font-black
            lineHeight: 1.2,
            letterSpacing: "-0.025em", // tracking-tight
            // color: "#00E5FF",
        },
        h2: {
            fontSize: "1.5rem", // text-2xl
            fontWeight: 800, // font-extrabold
            lineHeight: 1.3,
            color: "#ffffff",
        },
        h3: {
            fontSize: "0.75rem", // text-xs
            fontWeight: 700, // font-bold
            letterSpacing: "0.1em", // tracking-widest
            textTransform: "uppercase",
            color: "#a1a1aa", // zinc-500
        },
        h4: {
            fontSize: "1.125rem",//cards title
            fontWeight: 700,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: "0.7rem",// section header
            fontWeight: 600,
        },
        h6: {
            fontSize: "0.875rem", // text-sm
            fontWeight: 600,
            color: "#ffffff",
        },
        body1: {
            fontSize: "1rem", // medium card body
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#ffffff",
        },
        body2: {
            fontSize: "0.65rem", // small card body
            fontWeight: 500, 
            lineHeight: 1.5,
            color: "#a1a1aa", 
        },
        button: {
            fontSize: "1rem", // text-base
            fontWeight: 700, // font-bold
            textTransform: "uppercase",
            letterSpacing: "0.05em", // tracking-wide
        },
        caption: {
            fontSize: "0.75rem", // text-xs
            fontWeight: 600,
            color: "#71717a", // zinc-500
        },
        overline: {
            fontSize: "0.6875rem", // text-[11px]
            fontWeight: 700, // font-bold
            letterSpacing: "0.2em", // tracking-[0.2em]
            textTransform: "uppercase",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "20px", // rounded-ios
                    textTransform: "uppercase",
                    fontWeight: 900, // font-black
                    letterSpacing: "0.05em", // tracking-wide
                    padding: "16px 24px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                    "&:active": {
                        transform: "scale(0.96)",
                    },
                },
                // Размер small
                sizeSmall: {
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                    minHeight: "32px",
                    borderRadius: "12px",
                },
                // Размер medium (по умолчанию)
                sizeMedium: {
                    padding: "12px 20px",
                    fontSize: "0.6rem",
                    minHeight: "40px",
                },
                // Размер large
                sizeLarge: {
                    padding: "16px 24px",
                    fontSize: "1rem",
                    minHeight: "48px",
                },
                contained: {
                    // boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)", // high-contrast-shadow
                    "&:hover": {
                        boxShadow: "0 0 20px rgb(173, 247, 255, 0.25)"
                    },
                },
                outlined: {
                    borderWidth: "1px",
                    "&:hover": {
                        borderWidth: "1px",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#161618", // card-dark
                    borderRadius: "20px", // rounded-ios
                    border: "1px solid rgba(255, 255, 255, 0.05)", // border-white/5
                    boxShadow: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#161618", // card-dark
                    borderRadius: "20px", // rounded-ios
                    border: "1px solid rgba(255, 255, 255, 0.05)", // border-white/5
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px", // rounded-xl
                        backgroundColor: "#242426", // surface-dark
                        "& fieldset": {
                            borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                            borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#00E5FF",
                        },
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    "&:active": {
                        transform: "scale(0.9)",
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#0A0A0A", // bg-dark
                    color: "#ffffff",
                    minHeight: "100vh",
                    WebkitTapHighlightColor: "transparent",
                },
            },
        },
    },
    shadows: [
        "none",
        "0 0 20px rgba(0, 229, 255, 0.15)", // high-contrast-shadow
        "0 0 20px rgba(0, 229, 255, 0.2)",
        "0 0 20px rgba(0, 229, 255, 0.25)",
        "0 0 20px rgba(0, 229, 255, 0.3)",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
        "none",
    ] as any,
});
