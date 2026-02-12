import { Outlet } from "react-router-dom";
import WorkoutTimer from "./WorkoutTimer";

function TimerLayout() {
    return (
        <>
            <WorkoutTimer sx={{ position: 'fixed', top: '85px' }} />
            <Outlet />
        </>
    );
}

export default TimerLayout;
