import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppTitle } from './AppTitle';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/AppTitle',
    component: AppTitle,
} as ComponentMeta<typeof AppTitle>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppTitle> = (args) => <AppTitle {...args} />;

export const Primary = Template.bind({});
