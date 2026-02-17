import { Workout } from "@training-day/shared"
import { calculateWorkoutMuscleDistribution } from "../../utils/stats";
import { Box } from "@mui/material";
import { RadarChart } from '@mui/x-charts';

type TProps = {
    workout: Workout;
}
export default function MuscleRadarChart({ workout }: TProps) {
    const { metrics, data } = calculateWorkoutMuscleDistribution(workout);

    if (metrics.length < 3)
        return;

    const series = [
        {
            label: "Muscle load (%)",
            color: '#00E5FF',
            data,
        },
    ];

    return (
        <Box height={350}>
            <RadarChart
                radar={{ metrics }}
                series={series}
                height={250}
            />
        </Box>
    );
}