const IMPORTANT_KEYS = new Set([
  'AudioVolumeMute',
  'AudioVolumeDown',
  'AudioVolumeUp',
  'MediaTrackNext',
  'MediaTrackPrevious',
  'MediaStop',
  'MediaPlayPause',
  'Escape',
  'Enter',
  'Backspace',
  'Delete',
  'Insert',
  'ArrowUp',
  'Shift',
  'Alt',
  'Meta',
  'AltGraph',
  'CapsLock',
  'NumLock',
  'ScrollLock',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Tab',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
]);

export const isImportantKey = (event: KeyboardEvent): boolean => {
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return true;
  }

  return IMPORTANT_KEYS.has(event.key);
};
