import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { Activity } from "@training-day/shared";
import './ActivityResultCard.scss';
import { ExpandMore } from "@mui/icons-material";

type TProps = {
    activity: Activity;
}

export default function ActivityResultCard({ activity }: TProps) {
    return (
        <Accordion
            className="activity-result__activity-card"
            variant="outlined"
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box className="activity-result__activity-header">
                    <Typography variant="h6" className="activity-result__activity-name">
                        {activity.name}
                    </Typography>
                    <Typography variant="body2" className="activity-result__muscle-group">
                        {activity.type}
                    </Typography>
                </Box>
            </AccordionSummary>

            {activity.sets.length > 0 && (
                <AccordionDetails>
                    <Box className="activity-result__sets-header">
                        <Typography variant="caption" className="activity-result__set-label">
                            Set
                        </Typography>
                        <Typography variant="caption" className="activity-result__reps-label">
                            Reps
                        </Typography>
                        <Typography variant="caption" className="activity-result__weight-label">
                            Weight
                        </Typography>
                    </Box>
                    <Box className="activity-result__sets-list">
                        {activity.sets.map((set, index) => (
                            <Box key={set.id} className="activity-result__set-row">
                                <Typography variant="body2" className="activity-result__set-number">
                                    {index + 1}
                                </Typography>
                                <Typography variant="body2" className="activity-result__set-reps">
                                    {set.reps}
                                </Typography>
                                <Typography variant="body2" className="activity-result__set-weight">
                                    {set.weight > 0 ? `${set.weight}kg` : "-"}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </AccordionDetails>
            )}
        </Accordion>
    )
}