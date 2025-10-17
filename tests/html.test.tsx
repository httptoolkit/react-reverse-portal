import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStory } from '@storybook/react';
import type { RenderResult } from '@testing-library/react';
import * as stories from '../stories/html.stories';
import { wait, waitForVideoToLoad, getSpanOrder, findButtonByText } from './test-utils';

const allStoryNames = Object.keys(stories).filter(key => key !== 'default');

const storyTests: Record<string, (result: RenderResult) => void | Promise<void>> = {
  'RenderThingsInDifferentPlaces': ({ container }) => {
    expect(container.innerHTML).toContain(
      '<div>Portal renders here:<div>Hi!</div></div>'
    );
  },
  'ExampleFromREADME': ({ container }) => {
    expect(container.innerHTML).toContain('expensive!');
    expect(container.innerHTML).toContain('A:');
  },
  'PortalContainerElementAsSpanInParagraph': ({ container }) => {
    expect(container.innerHTML).toContain(
      '<p>Portal renders here:<span>Hi!</span></p>'
    );
  },
  'SwapNodesBetweenDifferentLocations': async ({ container, getByText }) => {
    expect(getSpanOrder(container)).toEqual(['0', '1', '2', '3', '4']);

    const button = getByText('Click to reverse the order');
    button.click();
    await wait(10);

    expect(getSpanOrder(container)).toEqual(['4', '3', '2', '1', '0']);
  },
  'CanPassAttributesOptionToCreateHtmlPortalNode': async ({ container, getByText }) => {
    expect(container.querySelector('#div-id-1')).toBeNull();

    const divsWithBgColor = Array.from(container.querySelectorAll('div')).filter(div =>
      div.getAttribute('style')?.includes('background-color: #aaf')
    );
    expect(divsWithBgColor).toHaveLength(0);

    const button = getByText('Click to pass attributes option to the intermediary div');
    button.click();
    await wait(10);

    const divWithId = container.querySelector('#div-id-1');
    expect(divWithId).not.toBeNull();
    expect(divWithId?.getAttribute('style')).toContain('background-color: #aaf');
    expect(divWithId?.getAttribute('style')).toContain('width: 204px');
  },
  'PortalContainerElementAsTr': async ({ container, getByText }) => {
    const tables = container.querySelectorAll('table');
    expect(tables).toHaveLength(2);

    const firstTableBody = tables[0].querySelector('tbody');
    const secondTableBody = tables[1].querySelector('tbody');

    expect(firstTableBody?.innerHTML).toContain('Cell 1');
    expect(firstTableBody?.innerHTML).toContain('Cell 2');
    expect(firstTableBody?.innerHTML).toContain('Cell 3');
    expect(secondTableBody?.innerHTML).not.toContain('Cell 1');

    const button = getByText('Move row to second table');
    button.click();
    await wait(10);

    const firstTableBodyAfter = tables[0].querySelector('tbody');
    const secondTableBodyAfter = tables[1].querySelector('tbody');

    expect(firstTableBodyAfter?.innerHTML).not.toContain('Cell 1');
    expect(secondTableBodyAfter?.innerHTML).toContain('Cell 1');
    expect(secondTableBodyAfter?.innerHTML).toContain('Cell 2');
    expect(secondTableBodyAfter?.innerHTML).toContain('Cell 3');
  },
  'PersistComponentStateWhilstMoving': async ({ container, getByText }) => {
    expect(container.textContent).toContain('Count is 0');

    const incrementButton = getByText('+1');
    incrementButton.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 1');

    const moveButton = getByText('Click to move the OutPortal');
    moveButton.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 1');

    incrementButton.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 2');
  },
  'CanSetPropsRemotelyWhilstMoving': async ({ container, getAllByText }) => {
    expect(container.textContent).toContain('Count is 0');

    const counterDiv = container.querySelector('div[style*="background-color"]') as HTMLElement;
    expect(counterDiv?.style.backgroundColor).toBe('rgb(170, 255, 170)');

    const incrementButton = counterDiv?.querySelector('button');
    expect(incrementButton).not.toBeNull();
    incrementButton!.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 1');

    const moveButtons = getAllByText('Click to move the OutPortal');
    moveButtons[1].click();
    await wait(10);

    expect(container.textContent).toContain('Count is 1');

    const counterDivAfter = container.querySelector('div[style*="background-color"]') as HTMLElement;
    expect(counterDivAfter?.style.backgroundColor).toBe('rgb(170, 170, 255)');

    const incrementButtonAfter = counterDivAfter?.querySelector('button');
    incrementButtonAfter!.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 2');
  },
  'CanSwitchBetweenPortalsSafely': async ({ container, getByText }) => {
    expect(container.textContent).toContain('Count is 0');

    const incrementButton = findButtonByText(container, '+1');
    expect(incrementButton).not.toBeNull();

    incrementButton!.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 1');

    const swapButton = getByText('Click to swap the portal shown');
    swapButton.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 0');

    const incrementButtonAfterSwap = findButtonByText(container, '+1');
    incrementButtonAfterSwap!.click();
    await wait(10);
    incrementButtonAfterSwap!.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 2');

    swapButton.click();
    await wait(10);

    expect(container.textContent).toContain('Count is 1');
  },
  'RendersReliablyEvenWithFrequentChangesAndMultiplePortals': async ({ container }) => {
    const getRenderedValue = () => {
      const text = container.textContent || '';
      const match = text.match(/Portal flickers between 2 \/ 3 \/ nothing here:(\d*)/);
      return match ? (match[1] || 'nothing') : 'nothing';
    };

    const seenValues = new Set<string>();
    const valueCounts = { '2': 0, '3': 0, 'nothing': 0 };

    for (let i = 0; i < 50; i++) {
      await wait(15); // UI code flickers every 10ms

      const value = getRenderedValue();
      seenValues.add(value);
      if (value === '2' || value === '3' || value === 'nothing') {
        valueCounts[value]++;
      }

      expect(['2', '3', 'nothing']).toContain(value);
    }

    expect(valueCounts['2']).toBeGreaterThanOrEqual(2);
    expect(valueCounts['3'] + valueCounts['nothing']).toBeGreaterThanOrEqual(2);
    expect(seenValues.size).toBeGreaterThanOrEqual(2);
  },
  'PersistDOMWhilstMoving': async ({ container, getAllByText }) => {
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

    const moveButtons = getAllByText('Click to move the OutPortal');
    moveButtons[0].click();
    await wait(50);

    const videoAfterMove = container.querySelector('video') as HTMLVideoElement;
    expect(videoAfterMove).toBe(video);
    expect(videoAfterMove.paused).toBe(false);
    expect(videoAfterMove.currentTime).toBeGreaterThanOrEqual(playbackPosition);
    expect(videoAfterMove.currentTime).toBeGreaterThan(playbackPosition);
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