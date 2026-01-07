import { Box } from "@mui/material";
import ExerciseCard from "../ExerciseCard";
import "./ExerciseList.scss";

export interface Exercise {
    id: string;
    name: string;
    icon: string;
    totalSets: number;
    completedSets: number;
    currentSet: number;
}

interface ExerciseListProps {
    exercises: Exercise[];
}

function ExerciseList({ exercises }: ExerciseListProps) {
    return (
        <Box className="exercise-list">
            {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </Box>
    );
}

export default ExerciseList;

