let metaEnv = {}
try {
  metaEnv = import.meta.env || {}
} catch (error) {
  metaEnv = {}
}

export const IS_DEV = Boolean((metaEnv.DEV ?? false) || (typeof window !== 'undefined' && window.location.hostname === 'localhost'))
