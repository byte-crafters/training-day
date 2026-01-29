import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./FeedbackButton.scss";

interface FeedbackButtonProps {
    className?: string;
}

function FeedbackButton({ className = "" }: FeedbackButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/feedback");
    };

    return (
        <IconButton
            className={`feedback-button ${className}`}
            onClick={handleClick}
            aria-label="Leave feedback"
        >   
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
        </IconButton>
    );
}

export default FeedbackButton;
