import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import BottomNavigation from "./BottomNavigation";

function NavigationLayout() {
    return (
        <>
            <Box sx={{ height: "calc(100vh - 64px)", overflow: "hidden", position: "relative" }}>
                <Outlet />
            </Box>
            <BottomNavigation />
        </>
    );
}

export default NavigationLayout;
