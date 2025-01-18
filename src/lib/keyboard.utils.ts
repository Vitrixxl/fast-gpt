const MODIFIER_KEYS = new Set([
  'Shift',
  'Alt',
  'Meta',
  'AltGraph',
  'CapsLock',
  'NumLock',
  'ScrollLock',
]);

const NAVIGATION_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Tab',
]);

const FUNCTION_KEYS = new Set([
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

const MEDIA_KEYS = new Set([
  'AudioVolumeMute',
  'AudioVolumeDown',
  'AudioVolumeUp',
  'MediaTrackNext',
  'MediaTrackPrevious',
  'MediaStop',
  'MediaPlayPause',
]);

const EDITING_KEYS = new Set([
  'Escape',
  'Enter',
  'Backspace',
  'Delete',
  'Insert',
]);

export const isImportantKey = (event: KeyboardEvent): boolean => {
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return true;
  }

  return MODIFIER_KEYS.has(event.key) ||
    NAVIGATION_KEYS.has(event.key) ||
    FUNCTION_KEYS.has(event.key) ||
    MEDIA_KEYS.has(event.key) ||
    EDITING_KEYS.has(event.key);
};
