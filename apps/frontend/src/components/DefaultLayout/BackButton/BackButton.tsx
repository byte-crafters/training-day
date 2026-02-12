import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

    return (
        <IconButton
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            sx={{ position: 'fixed', padding: '24px', color: '#ffffff', zIndex: 1000 }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
        </IconButton>
    );
}

export default BackButton;