/// <reference types="vite/client" />

declare module '*.svg?url' {
  const url: string
  export default url
}

declare module '*.svg?raw' {
  const raw: string
  export default raw
}
