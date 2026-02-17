import { Box, Typography } from "@mui/material";
import { Workout } from "@training-day/shared";
import { getWorkoutRecords } from "../../utils/stats";
import './WorkoutRecords.scss';

export type TRecordsProps = {
    workout: Workout;
}

export default function WorkoutRecords({ workout }: TRecordsProps) {

    const records = getWorkoutRecords(workout);

    return (
        <Box className="records-panel">
            {records.slice(0, 3).map((record) => {
                return (
                    <Box key={record.id} className="records-item">
                        <Typography className="records-item__label">{record.label}</Typography>
                        <Typography className="records-item__value">{record.value}</Typography>
                    </Box>
                )
            })}
        </Box>
    )
}
