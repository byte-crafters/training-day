import { Outlet } from "react-router-dom";
import BackButton from "./BackButton";
import FeedbackButton from "./FeedbackButton";

function DefaultLayout() {
    return (
        <>
            <BackButton />
            <FeedbackButton />
            <Outlet />
        </>
    );
}

export default DefaultLayout;