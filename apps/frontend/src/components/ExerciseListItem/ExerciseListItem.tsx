import { Box, Card, Typography } from "@mui/material";
import { Exercise } from "@training-day/shared";
import "./ExerciseListItem.scss";

export interface ExerciseListItemProps {
    id: string | undefined;
    exercise: Exercise;
    isSelected: boolean;
    onClick: () => void;
}

function ExerciseListItem({
    id,
    exercise,
    isSelected,
    onClick,
}: ExerciseListItemProps) {
    return (
        <Card
            id={id}
            variant="outlined"
            sx={{ padding: "15px 16px", borderRadius: "16px", margin: "5px" }}
            className="exercise-list-item"
            onClick={onClick}
        >
            <Typography variant="body1" className="exercise-list-item__name">
                {exercise.name}
            </Typography>
            <Box className={`exercise-list-item__icon ${isSelected ? 'exercise-list-item__icon--selected' : ''}`}>
                {isSelected ? (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                )}
            </Box>
        </Card>
    );
}

export default ExerciseListItem;
