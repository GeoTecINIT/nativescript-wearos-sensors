import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'es.uji.geotec.wearossensorsdemo',
  appPath: 'app',
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
} as NativeScriptConfig
