import { Outlet } from "react-router-dom";
import BottomNavigation from "../BottomNavigation";

function BottomNavigationLayout() {
    return (
        <>
            <Outlet />
            <BottomNavigation />
        </>
    );
}

export default BottomNavigationLayout;
