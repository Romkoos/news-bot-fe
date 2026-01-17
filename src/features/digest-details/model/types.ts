export interface NewsItemPreview {
  readonly id: number
  readonly source: string
  readonly rawText: string
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
