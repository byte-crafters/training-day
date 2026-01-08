import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./app/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import "./index.css";

async function enableMocking() {
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
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>
    );
});
