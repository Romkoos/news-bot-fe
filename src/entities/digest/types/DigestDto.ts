export interface DigestDto {
  readonly id: number
  readonly created_at: string
  readonly updated_at: string
  readonly digest_text: string
  readonly is_published: 0 | 1
  readonly source_item_ids_json: string
  readonly llm_model: string | null
  readonly published_at: string | null
}
