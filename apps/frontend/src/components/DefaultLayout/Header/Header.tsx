import { Box } from "@mui/material";
import { ReactNode } from "react";
import FeedbackButton from "./FeedbackButton";
import BackButton from "./BackButton";

type THeaderProps = {
    children?: ReactNode;
}

function Header({ children }: THeaderProps) {
    return (
        <Box sx={{
            // position: 'sticky',
            // top: '0px',
            display: 'flex',
            justifyContent: 'space-between',
            // backgroundColor: 'green',
            zIndex: '1002'
        }}>
            <BackButton />
            {children}
            <FeedbackButton />
        </Box >
    )
}

export default Header;