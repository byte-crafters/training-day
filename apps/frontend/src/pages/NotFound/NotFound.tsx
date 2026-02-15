import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { logAnalyticsEvent } from "../../utils/firebase";
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, ANALYTICS_PARAMS } from "../../utils/analytics";
import "./NotFound.scss";

function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        logAnalyticsEvent(ANALYTICS_EVENTS.SCREEN_VIEW, { [ANALYTICS_PARAMS.SCREEN_NAME]: ANALYTICS_SCREENS.NOT_FOUND });
    }, []);

    return (
        <Box className="not-found">
            <Box className="not-found__content">
                {/* <Typography variant="h1" className="not-found__title">
                    404
                </Typography>
                <Typography variant="h5" className="not-found__subtitle">
                    Page not found
                </Typography> */}
                <Typography variant="body1" className="not-found__description">
                    Coming Soon
                </Typography>
                <Typography>
                    this feature is not ready yet!
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate("/")}
                    className="not-found__button"
                >
                    Return to the main page
                </Button>
            </Box>
        </Box>
    );
}

export default NotFound;
