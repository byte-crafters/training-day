import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import WorkoutTracker from "../pages/WorkoutTracker";
import SelectExercises from "../pages/SelectExercises";
import MyWorkout from "../pages/MyWorkout";
import ExerciseDetail from "../pages/ExerciseDetail";
import EditSet from "../pages/EditSet";
import NotFound from "../pages/NotFound";
import { getExercises, getWorkouts, sendTelegramInitData } from "../utils/api";
import { setExercises, setWorkouts, useAppDispatch } from "../store";
import { useEffect } from "react";
import { useRawInitData } from "@tma.js/sdk-react";
import { toast } from "../utils/toast";
import { getAccessToken } from "../utils/cookies";

// Инициализация Telegram Mini App
// retrieveLaunchParams() читает данные из window.Telegram.WebApp.initData,
// которые доступны сразу при загрузке страницы (до загрузки React)

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
    const dispatch = useAppDispatch();

    const fetchWorkouts = async () => {
        try {
            const workouts = await getWorkouts();
            dispatch(setWorkouts(workouts));
            toast.info(`Загружено тренировок: ${workouts.length}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Не удалось загрузить тренировки";
            toast.error(`Ошибка загрузки тренировок: ${errorMessage}`);
            dispatch(setWorkouts([]));
        }
    };

    const fetchExercises = async () => {
        try {
            const exercises = await getExercises();
            dispatch(setExercises(exercises));
            toast.info(`Загружено упражнений: ${exercises.length}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Не удалось загрузить упражнения";
            toast.error(`Ошибка загрузки упражнений: ${errorMessage}`);
            dispatch(setExercises([]));
        }
    };

    const initDataRaw = useRawInitData();

    useEffect(() => {
        const initializeApp = async () => {
            // Сначала авторизуемся, чтобы получить токены в cookies
            if (initDataRaw && typeof initDataRaw === "string") {
                try {
                    const authResponse = await sendTelegramInitData(initDataRaw);
                    
                    // Небольшая задержка для установки cookies в браузере
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Получаем данные пользователя из ответа
                    if (authResponse.user) {
                        const { username, firstName, id, telegramUserId } = authResponse.user;
                        const displayName = username || firstName || `User ${telegramUserId}`;
                        
                        // Получаем access token для отладки (пробуем несколько раз с задержкой)
                        let accessToken = getAccessToken();
                        if (!accessToken) {
                            await new Promise(resolve => setTimeout(resolve, 200));
                            accessToken = getAccessToken();
                        }
                        
                        const tokenPreview = accessToken 
                            ? `${accessToken.substring(0, 30)}...${accessToken.substring(accessToken.length - 15)}`
                            : 'не найден';
                        
                        // Показываем уведомление с данными пользователя
                        const message = `Вход выполнен как: ${displayName}\nID: ${id.substring(0, 8)}...\nTG ID: ${telegramUserId}\nToken: ${tokenPreview}`;
                        toast.success(message, 8000);
                        
                        // Логируем полный токен в консоль для отладки
                        console.log('🔑 Access Token (full):', accessToken);
                        console.log('👤 User:', authResponse.user);
                        console.log('🍪 All cookies:', document.cookie);
                    }
                    
                    // После успешной авторизации загружаем данные
                    fetchWorkouts();
                    fetchExercises();
                } catch (error) {
                    // Ошибка уже показывается в api.ts
                    console.error("Failed to send Telegram init data:", error);
                    
                    // Проверяем, есть ли токен (на случай, если авторизация была раньше)
                    const accessToken = getAccessToken();
                    if (accessToken) {
                        console.log('⚠️ Авторизация не удалась, но токен найден:', accessToken.substring(0, 20) + '...');
                    }
                    
                    // Все равно пытаемся загрузить данные (на случай, если токены уже есть)
                    fetchWorkouts();
                    fetchExercises();
                }
            } else {
                // Если нет initData, все равно пытаемся загрузить данные
                fetchWorkouts();
                fetchExercises();
            }
        };

        initializeApp();
    }, [initDataRaw]);

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
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<WorkoutTracker />} />
                        <Route
                            path="/select-exercises"
                            element={<SelectExercises />}
                        />
                        <Route path="/my-workout" element={<MyWorkout />} />
                        <Route
                            path="/exercise-detail"
                            element={<ExerciseDetail />}
                        />
                        <Route path="/edit-set" element={<EditSet />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
