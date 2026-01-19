import type { Preview } from "@storybook/react-vite";
import React, { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/store/index";
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
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

        viewport: {
            options: {
                ...MINIMAL_VIEWPORTS,
                oneplus: {
                    name: 'OnePlus',
                    styles: {
                        width: '412px',
                        height: '915px',
                    },
                    type: 'mobile',
                },
            }
        },
    },
    
    decorators: [
        (Story, context): ReactElement => {
            // Проверяем, есть ли routerInitialEntries в параметрах story
            const initialEntries = (context.parameters?.router as { initialEntries?: any[] })?.initialEntries;
            
            return React.createElement(
                Provider,
                { store, children: React.createElement(
                    MemoryRouter,
                    initialEntries ? { initialEntries } : {},
                    React.createElement(Story)
                ) }
            );
        },
    ],
};

export default preview;
