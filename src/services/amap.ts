import AMapLoader from '@amap/amap-jsapi-loader'

type AMapNamespace = typeof globalThis & {
  AMap?: unknown
  _AMapSecurityConfig?: {
    securityJsCode?: string
  }
}

let amapPromise: Promise<unknown> | null = null

export function loadAmap() {
  if (amapPromise) return amapPromise

  const win = window as AMapNamespace
  const key = import.meta.env.VITE_AMAP_KEY as string | undefined
  const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE as string | undefined

  if (!key) {
    return Promise.reject(new Error('Missing VITE_AMAP_KEY'))
  }

  if (securityJsCode) {
    win._AMapSecurityConfig = {
      securityJsCode,
    }
  }

  amapPromise = AMapLoader.load({
    key,
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Driving', 'AMap.Geocoder', 'AMap.PlaceSearch'],
  })

  return amapPromise
}
