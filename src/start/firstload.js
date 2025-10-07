// Simple data loading without WordPress complexity
const templateData = {
  fields: {
    base: "/",
    template: ""
  }
};

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
  const assetRoot = computeAssetRoot();

  const normalized = {
    fields: {
      base: assetRoot || "/",
      template: assetRoot || ""
    }
  };

  return normalized;
}

export default { loadBootstrapData };
