import { configureActions } from "@storybook/addon-actions";

configureActions({
    depth: 5,
    limit: 30,
    clearOnStoryChange: true,
});
