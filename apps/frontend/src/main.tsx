import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import * as Sentry from "@sentry/react";
import App from "./app/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { initFirebase } from "./utils/firebase";
import "./sentry/instrument.js";
import "./index.css";
import { FirstWorkoutProvider } from "./features/first-workout/model/FirstWorkoutProvider";

initFirebase();

async function enableMocking() {
    return;

    console.log(import.meta.env.MODE);
    if (import.meta.env.MODE !== "development") {
        return;
    }

    const { worker } = await import("./mocks/browser");
    return worker.start({
        serviceWorker: {
            url: "/mockServiceWorker.js",
        },
        onUnhandledRequest: "bypass",
    });
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <Sentry.ErrorBoundary fallback={<div>Something went wrong.</div>} showDialog={false}>
                <Provider store={store}>
                    <FirstWorkoutProvider>
                        <App />
                    </FirstWorkoutProvider>
                </Provider>
            </Sentry.ErrorBoundary>
        </StrictMode>
    );
});
