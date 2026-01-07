import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkoutTracker from "../pages/WorkoutTracker";
import SelectExercises from "../pages/SelectExercises";
import MyWorkout from "../pages/MyWorkout";
import ExerciseDetail from "../pages/ExerciseDetail";
import EditSet from "../pages/EditSet";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#0066ff",
            dark: "#0052cc",
        },
        background: {
            default: "#1a1a1a",
            paper: "#2a2a2a",
        },
        text: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
        },
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WorkoutTracker />} />
                    <Route path="/select-exercises" element={<SelectExercises />} />
                    <Route path="/my-workout" element={<MyWorkout />} />
                    <Route path="/exercise-detail" element={<ExerciseDetail />} />
                    <Route path="/edit-set" element={<EditSet />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
