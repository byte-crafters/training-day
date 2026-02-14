import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import WorkoutTimer from "./WorkoutTimer";
import { LayoutContext } from "../DefaultLayout";

function TimerLayout() {
    const parentContext = useOutletContext<LayoutContext>();

    const location = useLocation();
    const showTimer = !location.state?.hideTimer;

    return (
        <>
            {showTimer && <WorkoutTimer sx={{ margin: '0 24px 10px' }} />}
            <Outlet context={parentContext} />
        </>
    );
}

export default TimerLayout;
