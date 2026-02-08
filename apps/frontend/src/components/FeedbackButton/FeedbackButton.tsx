import { IconButton } from "@mui/material";
import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/react";
import "./FeedbackButton.scss";

interface FeedbackButtonProps {
    className?: string;
}

function FeedbackButton({ className = "" }: FeedbackButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const feedback = Sentry.getFeedback();
        if (buttonRef.current) {
            feedback?.attachTo(buttonRef.current, { formTitle: "Report a Bug!" });
        }
    }, []);

    return (
        <IconButton
            ref={buttonRef}
            className={`feedback-button ${className}`}
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
