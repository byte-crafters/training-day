import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkoutTracker from "../pages/WorkoutTracker";
import SelectExercises from "../pages/SelectExercises";
import MyWorkout from "../pages/MyWorkout";
import ExerciseDetail from "../pages/ExerciseDetail";
import WorkoutResults from "../pages/WorkoutResults";
import FeedBackPage from "../pages/FeedBackPage";
import NotFound from "../pages/NotFound";
import NavigationLayout from "../components/NavigationLayout";
import { getExercises, getWorkouts, sendTelegramInitData } from "../utils/api";
import { logAnalyticsEvent } from "../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_PARAMS } from "../utils/analytics";
import { setExercises, setWorkouts, store, useAppDispatch } from "../store";
import { saveCurrentWorkout } from "../utils/storage";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRawInitData } from "@tma.js/sdk-react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { darkTheme } from "../theme";
import * as Sentry from "@sentry/react";
import DefaultLayout from "../components/DefaultLayout";
import TimerLayout from "../components/TimerLayout";

function App() {
    const dispatch = useAppDispatch();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const initDataMountTime = useRef<number | null>(null);

    const initDataRaw = useRawInitData();
    if (initDataMountTime.current === null) {
        initDataMountTime.current = performance.now();
    }

    useEffect(() => {
        if (initDataRaw && initDataMountTime.current !== null) {
            const elapsed = performance.now() - initDataMountTime.current;
            console.log(`[useRawInitData] время до появления данных: ${elapsed.toFixed(0)} ms`);
            initDataMountTime.current = null;
        }
    }, [initDataRaw]);

    const fetchWorkouts = useCallback(async () => {
        try {
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));
        } catch (error) {
            Sentry.captureException(error);
            dispatch(setWorkouts([]));
        }
    }, [dispatch]);

    const fetchExercises = useCallback(async () => {
        try {
            const exercises = await getExercises();
            dispatch(setExercises(exercises));
        } catch (error) {
            Sentry.captureException(error);
            dispatch(setExercises([]));
        }
    }, [dispatch]);

    useEffect(() => {
        // const saveWorkoutWithElapsedBeforeUnload = () => {
        //     const state = store.getState();
        //     if (!state.currentWorkout) return;
        //     const elapsedMs =
        //         state.timer.accumulated +
        //         (state.timer.startedAt ? Date.now() - state.timer.startedAt : 0);
        //     if (elapsedMs > 0) {
        //         saveCurrentWorkout({ ...state.currentWorkout, elapsedMs });
        //     }
        // };

        // window.addEventListener("beforeunload", saveWorkoutWithElapsedBeforeUnload);
        // window.addEventListener("pagehide", saveWorkoutWithElapsedBeforeUnload);

        // return () => {
        //     window.removeEventListener("beforeunload", saveWorkoutWithElapsedBeforeUnload);
        //     window.removeEventListener("pagehide", saveWorkoutWithElapsedBeforeUnload);
        // };
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            setIsAuthenticating(true);
            setAuthError(null);

            // Проверяем наличие initData
            if (!initDataRaw || typeof initDataRaw !== "string") {
                setAuthError("Failed to get authorization data. Please open the application through Telegram.");
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

                // Получаем данные пользователя из ответа и записываем контекст пользователя в Sentry
                if (authResponse.user) {
                    Sentry.setUser({
                        username: authResponse.user.username ?? null,
                        telegramUserId: authResponse.user.telegramUserId ?? null,
                    });

                    logAnalyticsEvent(ANALYTICS_EVENTS.LOGIN, { [ANALYTICS_PARAMS.METHOD]: "telegram" });
                }

                setIsAuthenticating(false);
                await Promise.all([fetchWorkouts(), fetchExercises()]);
            } catch (error) {
                Sentry.captureException(error);
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
                        <Route element={<NavigationLayout />}>
                            <Route path="/" element={<WorkoutTracker />} />
                            <Route path="/progress" element={<NotFound />} />
                            <Route path="/profile" element={<NotFound />} />
                            <Route path="/add-program" element={<NotFound />} />
                        </Route>
                        <Route element={<DefaultLayout />}>
                            <Route element={<TimerLayout />}>
                                <Route path="/my-workout" element={<MyWorkout />} />
                                <Route
                                    path="/exercise-detail"
                                    element={<ExerciseDetail />}
                                />
                            </Route>
                            <Route
                                path="/select-exercises"
                                element={<SelectExercises />}
                            />
                            <Route
                                path="/workout-results"
                                element={<WorkoutResults />}
                            />
                            <Route
                                path="/feedback"
                                element={<FeedBackPage />}
                            />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            )}
        </ThemeProvider>
    );
}

export default App;
