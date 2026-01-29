import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./BottomNavigation.scss";

function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(0);

    // Определяем активную вкладку на основе текущего пути
    useEffect(() => {
        const path = location.pathname;
        if (path === "/") {
            setValue(0); // Home
        } else if (path === "/select-exercises" || path === "/my-workout" || path === "/exercise-detail") {
            setValue(1); // Create
        } else if (path === "/progress") {
            setValue(2); // Progress
        } else if (path === "/profile") {
            setValue(3); // Profile
        }
    }, [location.pathname]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        
        switch (newValue) {
            case 0:
                navigate("/");
                break;
            case 1:
                // Create - переходим на страницу создания тренировки
                navigate("/select-exercises");
                break;
            case 2:
                // Progress - пока заглушка, потом будет отдельная страница
                navigate("/progress");
                break;
            case 3:
                // Profile - пока заглушка, потом будет отдельная страница
                navigate("/profile");
                break;
        }
    };

    const navigationElement = (
        <MuiBottomNavigation
            value={value}
            onChange={handleChange}
            className="bottom-navigation"
            showLabels
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                width: "100vw",
                maxWidth: "100vw",
                backgroundColor: "#000000",
                borderTop: "none",
                margin: 0,
                padding: 0,
                "&.MuiBottomNavigation-root": {
                    backgroundColor: "#000000",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: "100vw",
                    maxWidth: "100vw",
                    margin: 0,
                    padding: 0,
                },
                "& .MuiBottomNavigationAction-root": {
                    color: "#ffffff",
                    "&.Mui-selected": {
                        color: (theme) => theme.palette.primary.main,
                    },
                },
                "& .MuiBottomNavigationAction-label": {
                    color: "#ffffff",
                    "&.Mui-selected": {
                        color: (theme) => theme.palette.primary.main,
                    },
                },
            }}
        >
            <BottomNavigationAction
                label="Home"
                icon={<HomeIcon />}
            />
            <BottomNavigationAction
                label="Create"
                icon={<AddIcon />}
            />
            <BottomNavigationAction
                label="Progress"
                icon={<TrendingUpIcon />}
            />
            <BottomNavigationAction
                label="Profile"
                icon={<PersonIcon />}
            />
        </MuiBottomNavigation>
    );

    // Рендерим через Portal напрямую в body или #storybook-root, чтобы избежать проблем с прокруткой
    if (typeof document !== "undefined") {
        // В Storybook используем #storybook-root, в обычном приложении - body
        const portalTarget = document.getElementById("storybook-root") || document.body;
        return createPortal(navigationElement, portalTarget);
    }

    return navigationElement;
}

export default BottomNavigation;
