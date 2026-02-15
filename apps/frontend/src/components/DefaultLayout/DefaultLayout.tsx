import { Outlet } from "react-router-dom";
import { ReactNode, useState } from "react";
import Header from "./Header";
import { Box } from "@mui/material";

export type LayoutContext = {
    setHeaderContent: (node: ReactNode) => void;
};

function DefaultLayout() {
    const [headerContent, setHeaderContent] = useState<ReactNode>(null);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header>
                {headerContent}
            </Header>
            <Outlet context={{ setHeaderContent }} />
        </Box>
    );
}

export default DefaultLayout;