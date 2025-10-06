import { options } from '../data/wpData.js';

const clone = (value) =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const computeAssetRoot = () => {
  const raw = (document.body?.dataset?.js ?? '').trim();
  if (!raw) return '';
  if (/^https?:\/\//.test(raw)) {
    try {
      return new URL(raw, window.location.origin).pathname.replace(/\/+$/, '');
    } catch {
      return '';
    }
  }
  return `/${raw.replace(/^\/+|\/+$/g, '')}`;
};

export async function loadBootstrapData() {
  const assetRoot = computeAssetRoot();         // '' if you serve at /
  const uploadsPrefix = '/public/uploads/';
  const uploadsTarget = assetRoot
    ? `${assetRoot}${uploadsPrefix}`
    : uploadsPrefix;

  const normalized = JSON.parse(
    JSON.stringify(clone(options)).replaceAll(uploadsPrefix, uploadsTarget)
  );

  if (normalized?.fields) {
    normalized.fields.base = assetRoot;
    normalized.fields.template = assetRoot || '';
  }

  return normalized;
}

export default { loadBootstrapData };
