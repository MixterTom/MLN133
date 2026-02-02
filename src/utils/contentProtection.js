export function installContentProtection({
  disableContextMenu = true,
  disableSelection = true,
} = {}) {
  if (typeof document === 'undefined') return () => {};

  const onContextMenu = (e) => {
    if (!disableContextMenu) return;

    const target = e.target;
    const tag = target?.tagName?.toLowerCase?.();
    const isEditable =
      tag === 'input' ||
      tag === 'textarea' ||
      target?.isContentEditable === true;

    if (isEditable) return;

    e.preventDefault();
  };

  const onSelectStart = (e) => {
    if (!disableSelection) return;

    const target = e.target;
    const tag = target?.tagName?.toLowerCase?.();
    const isEditable =
      tag === 'input' ||
      tag === 'textarea' ||
      target?.isContentEditable === true;

    if (isEditable) return;

    e.preventDefault();
  };

  if (disableContextMenu) {
    document.addEventListener('contextmenu', onContextMenu, { capture: true });
  }

  if (disableSelection) {
    document.addEventListener('selectstart', onSelectStart, { capture: true });
    document.body?.classList?.add('no-text-select');
  }

  return () => {
    if (disableContextMenu) {
      document.removeEventListener('contextmenu', onContextMenu, {
        capture: true,
      });
    }

    if (disableSelection) {
      document.removeEventListener('selectstart', onSelectStart, {
        capture: true,
      });
      document.body?.classList?.remove('no-text-select');
    }
  };
}
