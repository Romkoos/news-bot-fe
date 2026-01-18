import { Alert, Button, Form, Input, Select, Space, Spin, Typography, message } from 'antd'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useLlmConfigStore } from 'entities/llm-config'
import { formatDateTime } from 'shared/lib'

interface LlmConfigFormValues {
  readonly model: string
  readonly instructions: string
}

export function LlmPage(): ReactElement {
  const { t } = useTranslation()
  const [form] = Form.useForm<LlmConfigFormValues>()

  const item = useLlmConfigStore((s) => s.item)
  const status = useLlmConfigStore((s) => s.status)
  const error = useLlmConfigStore((s) => s.error)
  const load = useLlmConfigStore((s) => s.load)

  const isSaving = useLlmConfigStore((s) => s.isSaving)
  const saveError = useLlmConfigStore((s) => s.saveError)
  const save = useLlmConfigStore((s) => s.save)

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (item) {
      form.setFieldsValue({ model: item.model, instructions: item.instructions })
    }
  }, [form, item])

  const isInitialLoading = status === 'loading' && item === null
  const isError = status === 'error'

  const modelOptions = useMemo(() => {
    if (!item) {
      return []
    }
    // Single allowed option for now (from backend).
    return [{ value: item.model, label: item.model }]
  }, [item])

  const updatedAtLabel = useMemo(() => {
    const formatted = formatDateTime(item?.updatedAt ?? null)
    return formatted ?? t('common.notAvailable')
  }, [item?.updatedAt, t])

  const handleRetry = useCallback((): void => {
    void load({ force: true })
  }, [load])

  const handleSave = useCallback(
    async (values: LlmConfigFormValues): Promise<void> => {
      try {
        await save({ model: values.model, instructions: values.instructions })
        message.success(t('llmConfig.messages.saved'))
      } catch {
        message.error(t('llmConfig.messages.saveFailed'))
      }
    },
    [save, t],
  )

  if (isInitialLoading) {
    return <Spin tip={t('common.loading')} />
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message={t('common.error')}
        description={error ?? undefined}
        action={
          <Button onClick={handleRetry} type="primary">
            {t('common.retry')}
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {t('llmConfig.title')}
      </Typography.Title>

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {saveError ? (
          <Alert type="error" showIcon message={t('common.error')} description={saveError} />
        ) : null}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSave}
          disabled={item === null || isSaving}
        >
          <Form.Item<LlmConfigFormValues>
            label={t('llmConfig.fields.model')}
            name="model"
            rules={[{ required: true, message: t('llmConfig.validation.modelRequired') }]}
          >
            <Select options={modelOptions} />
          </Form.Item>

          <Form.Item<LlmConfigFormValues>
            label={t('llmConfig.fields.instructions')}
            name="instructions"
            rules={[{ required: true, message: t('llmConfig.validation.instructionsRequired') }]}
          >
            <Input.TextArea autoSize={{ minRows: 6, maxRows: 18 }} />
          </Form.Item>

          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('llmConfig.fields.updatedAt')}: {updatedAtLabel}
          </Typography.Paragraph>

          <div style={{ marginTop: 12 }}>
            <Button htmlType="submit" type="primary" loading={isSaving} disabled={item === null}>
              {t('llmConfig.actions.save')}
            </Button>
          </div>
        </Form>
      </Space>
    </div>
  )
}
