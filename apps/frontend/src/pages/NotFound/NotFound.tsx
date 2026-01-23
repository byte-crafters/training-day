import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import "./NotFound.scss";

function NotFound() {
    const navigate = useNavigate();

    return (
        <Box className="not-found">
            <Box className="not-found__content">
                <Typography variant="h1" className="not-found__title">
                    404
                </Typography>
                <Typography variant="h5" className="not-found__subtitle">
                    Страница не найдена
                </Typography>
                <Typography variant="body1" className="not-found__description">
                    К сожалению, запрашиваемая страница не существует.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    className="not-found__button"
                >
                    Вернуться на главную
                </Button>
            </Box>
        </Box>
    );
}

export default NotFound;
