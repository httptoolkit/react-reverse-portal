export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waitForVideoToLoad = (video: HTMLVideoElement): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Video load timeout after 30s')), 30000);

    const cleanup = () => clearTimeout(timeout);

    if (video.readyState >= 2) {
      cleanup();
      resolve();
      return;
    }

    const onSuccess = () => {
      cleanup();
      resolve();
    };

    const onError = (e: Event) => {
      cleanup();
      reject(new Error(`Video failed to load: ${(e.target as HTMLVideoElement)?.error?.message || 'unknown error'}`));
    };

    video.addEventListener('loadeddata', onSuccess, { once: true });
    video.addEventListener('canplay', onSuccess, { once: true });
    video.addEventListener('error', onError, { once: true });

    video.load();
  });
};

export const getSpanOrder = (container: HTMLElement): string[] => {
  const spans = container.querySelectorAll('span');
  return Array.from(spans).map(span => span.textContent);
};

export const findButtonByText = (container: HTMLElement, text: string): HTMLButtonElement | undefined => {
  const buttons = container.querySelectorAll('button');
  return Array.from(buttons).find(btn => btn.textContent === text) as HTMLButtonElement | undefined;
};
