export type ApiErrorKind = 'Network' | 'Http' | 'Parse' | 'Abort'

export class ApiError extends Error {
  public readonly kind: ApiErrorKind
  public readonly cause?: unknown

  public constructor(kind: ApiErrorKind, message: string, cause?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.cause = cause
  }
}

export class HttpError extends ApiError {
  public readonly status: number
  public readonly url: string
  public readonly responseText?: string

  public constructor(params: { status: number; url: string; responseText?: string }) {
    const { status, url, responseText } = params
    super('Http', `HTTP ${status} for ${url}`, responseText)
    this.name = 'HttpError'
    this.status = status
    this.url = url
    this.responseText = responseText
  }
}
