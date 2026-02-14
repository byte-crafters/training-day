import { Box } from "@mui/material";
import { Workout } from "@training-day/shared";

export type TRecordsProps = {
    workout: Workout;
}

export default function WorkoutRecords({ workout }: TRecordsProps) {
    console.log(workout)

    return (
        <Box>
            {workout.name}
        </Box>
    )
}