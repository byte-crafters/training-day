import type { Preview } from "@storybook/react-vite";
import React, { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/store/index";
import "../src/index.css";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
    },
    
    decorators: [
        (Story, context) => {
            // Проверяем, есть ли routerInitialEntries в параметрах story
            const initialEntries = (context.parameters?.router as { initialEntries?: any[] })?.initialEntries;
            
            return (
                <Provider store={store}>
                    <MemoryRouter {...(initialEntries ? { initialEntries } : {})}>
                        <Story />
                    </MemoryRouter>
                </Provider>
            );
        },
    ],
};

export default preview;
