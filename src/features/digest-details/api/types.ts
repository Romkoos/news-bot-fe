/**
 * Backend DTO for a source news item.
 *
 * Note: The UI for digest details intentionally uses only `id`, `raw_text`, and `source`.
 */
export interface NewsItemDto {
  readonly id: number
  readonly source: string
  readonly raw_text: string
  readonly published_at: string | null
  readonly scraped_at: string
  readonly processed: 0 | 1
  readonly media_type: 'video' | 'image' | null
  readonly media_url: string | null
}
