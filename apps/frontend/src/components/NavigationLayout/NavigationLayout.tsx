import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import BottomNavigation from "./BottomNavigation";

function NavigationLayout() {
    return (
        <>

            <Box sx={{ height: "100vh", overflow: "hidden", position: "relative" }}>
                <Outlet />
            </Box>
            <BottomNavigation />
        </>
    );
}

export default NavigationLayout;
