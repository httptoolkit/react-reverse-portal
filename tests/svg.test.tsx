import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStory } from '@storybook/react';
import type { RenderResult } from '@testing-library/react';
import * as stories from '../stories/svg.stories';
import { wait, waitForVideoToLoad } from './test-utils';

const allStoryNames = Object.keys(stories).filter(key => key !== 'default');

const storyTests: Record<string, (result: RenderResult) => void | Promise<void>> = {
  'WorksWithSVGs': ({ container }) => {
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const texts = svg?.querySelectorAll('text');
    expect(texts?.length).toBe(1);
    expect(texts?.[0].textContent).toBe('test');
    expect(texts?.[0].getAttribute('fill')).toBe('red');
  },
  'CanMoveContentAroundWithinSVGs': async ({ container, getByText }) => {
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const nestedSvgs = svg?.querySelectorAll('svg');
    expect(nestedSvgs?.length).toBe(2);

    const firstSvg = nestedSvgs?.[0];
    const secondSvg = nestedSvgs?.[1];

    expect(firstSvg?.querySelector('text')).toBeNull();
    expect(secondSvg?.querySelector('text')).not.toBeNull();
    expect(secondSvg?.querySelector('text')?.textContent).toBe('test');

    const button = getByText('Click to move the OutPortal within the SVG');
    button.click();
    await wait(10);

    expect(firstSvg?.querySelector('text')).not.toBeNull();
    expect(firstSvg?.querySelector('text')?.textContent).toBe('test');
    expect(secondSvg?.querySelector('text')).toBeNull();
  },
  'PersistDOMWhileMovingWithinSVGs': async ({ container }) => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video).not.toBeNull();
    expect(video.src).toContain('giphy.mp4');

    await waitForVideoToLoad(video);
    expect(video.paused).toBe(true);
    await video.play();
    await wait(200);

    expect(video.paused).toBe(false);
    const playbackPosition = video.currentTime;
    expect(playbackPosition).toBeGreaterThan(0);

    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    button.click();
    await wait(50);

    const videoAfterMove = container.querySelector('video') as HTMLVideoElement;
    expect(videoAfterMove).toBe(video);
    expect(videoAfterMove.paused).toBe(false);
    expect(videoAfterMove.currentTime).toBeGreaterThanOrEqual(playbackPosition);
    expect(videoAfterMove.currentTime).toBeGreaterThan(playbackPosition);
  },
  'CanPassAttributesOptionToCreateSvgPortalNode': async ({ container, getByText }) => {
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const nestedSvg = svg?.querySelector('svg');
    expect(nestedSvg).not.toBeNull();

    const portalWrapper = nestedSvg?.querySelector('g');
    expect(portalWrapper).not.toBeNull();
    expect(portalWrapper?.getAttribute('stroke')).toBeNull();

    const button = getByText('Click to pass attributes option to the intermediary svg');
    button.click();
    await wait(10);

    const portalWrapperAfter = nestedSvg?.querySelector('g');
    expect(portalWrapperAfter?.getAttribute('stroke')).toBe('blue');
  },
};

test('all stories have tests', () => {
  const testedStories = Object.keys(storyTests);
  const untestedStories = allStoryNames.filter(name => !testedStories.includes(name));

  if (untestedStories.length > 0) {
    throw new Error(
      `The following stories do not have tests:\n${untestedStories.map(s => `  - ${s}`).join('\n')}`
    );
  }
});

Object.entries(storyTests).forEach(([storyName, testFn]) => {
  test(storyName, async () => {
    const Story = composeStory(
      (stories as any)[storyName],
      stories.default
    );
    const result = render(<Story />);
    await testFn(result);
  });
});
