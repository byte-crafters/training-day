import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { RootState, updateWorkoutName, useAppDispatch, useAppSelector } from "../../store";

export default function EditNameHeader() {
    const dispatch = useAppDispatch();

    const currentWorkout = useAppSelector(
        (state: RootState) => state.currentWorkout
    );
    const workoutName = currentWorkout?.name || "Untitled Workout";
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(workoutName);
    const textRef = useRef<HTMLDivElement>(null);
    const [textWidth, setTextWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        setEditedName(workoutName);
    }, [workoutName]);

    useEffect(() => {
        if (textRef.current && !isEditingName) {
            const width = textRef.current.offsetWidth;
            setTextWidth(width);
        }
    }, [workoutName, isEditingName]);

    const handleStartEditName = () => {
        console.log('No rerender!?')
        setIsEditingName(true);
        setEditedName(workoutName);
    };

    const handleSaveName = () => {
        if (editedName.trim()) {
            dispatch(updateWorkoutName(editedName.trim()));
        } else {
            setEditedName(workoutName);
        }
        setIsEditingName(false);
    };

    const handleCancelEditName = () => {
        setEditedName(workoutName);
        setIsEditingName(false);
    };

    return (
        <Box component="header" className="my-workout__header">

            <Box className="my-workout__name-section">
                {isEditingName ? (
                    <Box className="my-workout__name-edit">
                        <TextField
                            className="my-workout__name-input"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            sx={
                                textWidth ? { width: `${textWidth}px` } : {}
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSaveName();
                                } else if (e.key === "Escape") {
                                    handleCancelEditName();
                                }
                            }}
                            autoFocus
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />
                        <IconButton
                            className="my-workout__save-button"
                            onClick={handleSaveName}
                            aria-label="Save"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </IconButton>
                    </Box>
                ) : (
                    <Box className="my-workout__name-display">
                        <Typography
                            style={{ fontSize: "20px" }}
                            ref={textRef}
                            className="my-workout__name-text"
                        >
                            {workoutName.length > 10 ? `${workoutName.slice(0, 10)}...` : workoutName}
                        </Typography>
                        <IconButton
                            className="my-workout__edit-button"
                            onClick={handleStartEditName}
                            aria-label="Edit"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    )
}