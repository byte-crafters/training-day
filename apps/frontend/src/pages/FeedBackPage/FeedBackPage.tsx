import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import "./FeedBackPage.scss";
import { sendFeedback } from "../../utils/api";
import { toast } from "../../utils/toast";

function FeedBackPage() {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitFeedback = async () => {
        if (!feedback.trim()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            await sendFeedback(feedback);
            toast.success("Feedback sent successfully!");
            setFeedback("");
            navigate(-1);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            // Ошибка уже обработана в fetchAPI и показана через toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitFeedback();
    };

    return (
        <Box className="feedback-page">
            <Box component="header" className="feedback-page__header">
                <IconButton
                    className="feedback-page__back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                    sx={{ color: '#ffffff' }}
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
                <Typography variant="h4" className="feedback-page__title">
                    Leave Feedback
                </Typography>
                <Box className="feedback-page__header-spacer" />
            </Box>

            <Box component="main" className="feedback-page__main">
                <form onSubmit={handleSubmit} className="feedback-page__form">
                    <Typography variant="body1" className="feedback-page__description">
                        We'd love to hear your thoughts, suggestions, or report any issues you've encountered.
                    </Typography>

                    <TextField
                        multiline
                        rows={8}
                        fullWidth
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your feedback, suggestions, or report issues..."
                        className="feedback-page__textarea"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#161618',
                                color: '#ffffff',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#00d4ff',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: '#ffffff',
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgba(255, 255, 255, 0.5)',
                            },
                        }}
                    />
                </form>
            </Box>

            <Box className="feedback-page__footer">
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!feedback.trim() || isSubmitting}
                    className="feedback-page__submit-button"
                    onClick={submitFeedback}
                >
                    {isSubmitting ? "Sending..." : "Send Feedback"}
                </Button>
            </Box>
        </Box>
    );
}

export default FeedBackPage;
