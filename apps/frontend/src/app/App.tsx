import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import WorkoutTracker from "../pages/WorkoutTracker";
import SelectExercises from "../pages/SelectExercises";
import MyWorkout from "../pages/MyWorkout";
import ExerciseDetail from "../pages/ExerciseDetail";
import WorkoutResults from "../pages/WorkoutResults";
import NotFound from "../pages/NotFound";
import BottomNavigationLayout from "../components/BottomNavigationLayout";
import { getExercises, getWorkouts, sendTelegramInitData } from "../utils/api";
import { setExercises, setWorkouts, useAppDispatch } from "../store";
import { useEffect, useState, useCallback } from "react";
import { useRawInitData } from "@tma.js/sdk-react";
import { toast } from "../utils/toast";
import { Box, CircularProgress, Typography } from "@mui/material";
import { darkTheme } from "../theme";

function App() {
    const dispatch = useAppDispatch();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const initDataRaw = useRawInitData();

    const fetchWorkouts = useCallback(async () => {
        try {
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));
            toast.info(`Загружено тренировок: ${workouts.length}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Не удалось загрузить тренировки";
            toast.error(`Ошибка загрузки тренировок: ${errorMessage}`);
            dispatch(setWorkouts([]));
        }
    }, [dispatch]);

    const fetchExercises = useCallback(async () => {
        try {
            const exercises = await getExercises();
            dispatch(setExercises(exercises));
            toast.info(`Got ${exercises.length} new exercises`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Не удалось загрузить упражнения";
            toast.error(`Error loading exercises: ${errorMessage}`);
            dispatch(setExercises([]));
        }
    }, [dispatch]);

    useEffect(() => {
        const initializeApp = async () => {
            setIsAuthenticating(true);
            setAuthError(null);

            // Проверяем наличие initData
            if (!initDataRaw || typeof initDataRaw !== "string") {
                const errorMsg = "Failed to get authorization data. Please open the application through Telegram.";
                setAuthError(errorMsg);
                toast.error(errorMsg);
                setIsAuthenticating(false);
                return;
            }

            // Сохраняем initDataRaw в sessionStorage['initData'] для использования в getInitData()
            // Это гарантирует, что полный initData с hash параметром доступен для всех API запросов
            try {
                sessionStorage.setItem('initData', initDataRaw);
            } catch (e) {
                console.warn('Failed to save initData to sessionStorage:', e);
            }

            // Создаем/обновляем пользователя в БД - это обязательный шаг перед любыми запросами
            try {
                const authResponse = await sendTelegramInitData(initDataRaw);

                // Получаем данные пользователя из ответа
                if (authResponse.user) {
                    const { username, firstName, telegramUserId } = authResponse.user;
                    const displayName = username || firstName || `User ${telegramUserId}`;

                    // Показываем уведомление о успешном входе
                    toast.success(`Logged in as: ${displayName}`);
                }

                setIsAuthenticating(false);
                await Promise.all([fetchWorkouts(), fetchExercises()]);
            } catch (error) {

                const errorMessage = error instanceof Error ? error.message : "Ошибка авторизации";
                setAuthError(errorMessage);
                setIsAuthenticating(false);
                console.error("Failed to authenticate:", error);
            }
        };

        initializeApp();
    }, [initDataRaw, fetchWorkouts, fetchExercises]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={4000}
            >
                {isAuthenticating && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                            gap: 2,
                        }}
                    >
                        <CircularProgress />
                        <Typography variant="body1" color="text.secondary">
                            Authorizing...
                        </Typography>
                    </Box>
                )}

                {authError && !isAuthenticating && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                            gap: 2,
                            p: 3,
                        }}
                    >
                        <Typography variant="h6" color="error" align="center">
                            Authorization error
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {authError}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                            Please reload the page
                        </Typography>
                    </Box>
                )}

                {!isAuthenticating && !authError && (
                    <BrowserRouter>
                        <Routes>
                            <Route element={<BottomNavigationLayout />}>
                                <Route path="/" element={<WorkoutTracker />} />
                                <Route path="/progress" element={<NotFound />} />
                                <Route path="/profile" element={<NotFound />} />
                                <Route
                                    path="/select-exercises"
                                    element={<SelectExercises />}
                                />
                            </Route>
                            <Route path="/my-workout" element={<MyWorkout />} />
                            <Route
                                path="/exercise-detail"
                                element={<ExerciseDetail />}
                            />
                            <Route
                                path="/workout-results"
                                element={<WorkoutResults />}
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                )}
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
