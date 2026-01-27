import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import "./NotFound.scss";
import FeedbackButton from "../../components/FeedbackButton";

function NotFound() {
    const navigate = useNavigate();

    return (
        <Box className="not-found">
            <Box className="not-found__content">
                <Typography variant="h1" className="not-found__title">
                    404
                </Typography>
                <Typography variant="h5" className="not-found__subtitle">
                    Page not found
                </Typography>
                <Typography variant="body1" className="not-found__description">
                    Unfortunately, the requested page does not exist.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    className="not-found__button"
                >
                    Return to the main page
                </Button>
            </Box>

            <FeedbackButton />
        </Box>
    );
}

export default NotFound;
