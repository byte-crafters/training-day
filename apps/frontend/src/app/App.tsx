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

// Инициализация Telegram Mini App
// retrieveLaunchParams() читает данные из window.Telegram.WebApp.initData,
// которые доступны сразу при загрузке страницы (до загрузки React)

function App() {
    const dispatch = useAppDispatch();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const initDataRaw = useRawInitData();

    // Мемоизируем функции загрузки данных
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
            toast.info(`Загружено упражнений: ${exercises.length}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Не удалось загрузить упражнения";
            toast.error(`Ошибка загрузки упражнений: ${errorMessage}`);
            dispatch(setExercises([]));
        }
    }, [dispatch]);

    useEffect(() => {
        const initializeApp = async () => {
            setIsAuthenticating(true);
            setAuthError(null);

            // Проверяем наличие initData
            if (!initDataRaw || typeof initDataRaw !== "string") {
                const errorMsg = "Не удалось получить данные авторизации. Пожалуйста, откройте приложение через Telegram.";
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
                    toast.success(`Вход выполнен как: ${displayName}`, 4000);
                }

                // Только после успешной авторизации загружаем данные
                setIsAuthenticating(false);
                await Promise.all([fetchWorkouts(), fetchExercises()]);
            } catch (error) {
                // Ошибка уже показывается в api.ts через toast
                const errorMessage = error instanceof Error ? error.message : "Ошибка авторизации";
                setAuthError(errorMessage);
                setIsAuthenticating(false);
                console.error("Failed to authenticate:", error);
                // Не загружаем данные при ошибке авторизации
            }
        };

        initializeApp();
    }, [initDataRaw, fetchWorkouts, fetchExercises]);

    // Обертываем все в SnackbarProvider с самого начала, чтобы toast работал во всех состояниях
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
                {/* Показываем загрузку во время авторизации */}
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
                            Authorization...
                        </Typography>
                    </Box>
                )}

                {/* Показываем ошибку авторизации */}
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
                            Ошибка авторизации
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {authError}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                            Пожалуйста, перезагрузите страницу
                        </Typography>
                    </Box>
                )}

                {/* Основное приложение */}
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
