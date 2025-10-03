import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStory } from '@storybook/react';
import * as stories from '../stories/html.stories';

const RenderThingsInDifferentPlaces = composeStory(
  stories.RenderThingsInDifferentPlaces,
  stories.default
);

test('RenderThingsInDifferentPlaces', async () => {
  const { container } = render(<RenderThingsInDifferentPlaces />);

  expect(container.innerHTML).toContain(
    '<div>Portal renders here:<div>Hi!</div></div>'
  );
});
