/**
 * LLM configuration returned by the backend.
 *
 * Notes:
 * - `updatedAt` is an ISO date-time string set by the backend at update time.
 */
export type LlmConfig = {
  readonly model: string
  readonly instructions: string
  readonly updatedAt: string
}
