import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Web3LatestBlockNo } from './Web3LatestBlockNo';

//Duplicate story to show how Rollup creates chunks

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/Web3LatestBlockNo2',
    component: Web3LatestBlockNo,
} as ComponentMeta<typeof Web3LatestBlockNo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Web3LatestBlockNo> = (args) => <Web3LatestBlockNo {...args} />;

export const Primary = Template.bind({});
