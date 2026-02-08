import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import "./BottomNavigation.scss";

const NAV_ITEMS = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/add-program", label: "Create", icon: AddIcon },
    { path: "/progress", label: "Progress", icon: TrendingUpIcon },
    { path: "/profile", label: "Profile", icon: PersonIcon },
] as const;

// Пути, при которых считаем активной вкладку "Create"
const CREATE_PATHS = ["/select-exercises", "/my-workout", "/exercise-detail", "/workout-results"];

function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveIndex = () => {
        const path = location.pathname;
        if (path === "/") return 0;
        if (CREATE_PATHS.some((p) => path.startsWith(p)) || path === "/add-program") return 1;
        if (path === "/progress") return 2;
        if (path === "/profile") return 3;
        return 0;
    };

    const activeIndex = getActiveIndex();

    const handleClick = (index: number) => {
        const item = NAV_ITEMS[index];
        navigate(item.path);
    };

    const navigationElement = (
        <nav className="bottom-navigation" role="navigation" aria-label="Bottom navigation">
            <div className="bottom-navigation__pill">
                {NAV_ITEMS.map((item, index) => {
                    const isActive = activeIndex === index;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.path}
                            type="button"
                            className={`bottom-navigation__item ${isActive ? "bottom-navigation__item--active" : ""}`}
                            onClick={() => handleClick(index)}
                            aria-label={item.label}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className="bottom-navigation__icon-wrap">
                                <Icon className="bottom-navigation__icon" />
                            </span>
                            <span className="bottom-navigation__label">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );

    if (typeof document !== "undefined") {
        const portalTarget = document.getElementById("storybook-root") || document.body;
        return createPortal(navigationElement, portalTarget);
    }

    return navigationElement;
}

export default BottomNavigation;
