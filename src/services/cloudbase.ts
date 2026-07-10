import cloudbase from '@cloudbase/js-sdk'

let app: ReturnType<typeof cloudbase.init> | null = null

export function getCloudbaseApp() {
  if (app) return app

  const env = import.meta.env.VITE_CLOUDBASE_ENV_ID as string | undefined
  const region = import.meta.env.VITE_CLOUDBASE_REGION as string | undefined

  if (!env) {
    throw new Error('Missing VITE_CLOUDBASE_ENV_ID')
  }

  app = cloudbase.init({
    env,
    ...(region ? { region } : {}),
  })

  return app
}

export function getDatabase() {
  return getCloudbaseApp().database()
}
