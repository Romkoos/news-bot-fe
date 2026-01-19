import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'antd'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLlmConfigStore } from 'entities/llm-config'
import { useLlmManagementStore } from 'features/llm-management'
import { formatDateTime } from 'shared/lib'

interface LlmConfigFormValues {
  readonly modelId: number | null
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

  const llms = useLlmManagementStore((s) => s.llms)
  const llmsStatus = useLlmManagementStore((s) => s.llmsStatus)
  const llmsError = useLlmManagementStore((s) => s.llmsError)
  const selectedLlmId = useLlmManagementStore((s) => s.selectedLlmId)
  const models = useLlmManagementStore((s) => s.models)
  const modelsStatus = useLlmManagementStore((s) => s.modelsStatus)
  const modelsError = useLlmManagementStore((s) => s.modelsError)
  const isMutating = useLlmManagementStore((s) => s.isMutating)
  const mutationError = useLlmManagementStore((s) => s.mutationError)
  const loadLlms = useLlmManagementStore((s) => s.loadLlms)
  const selectLlm = useLlmManagementStore((s) => s.selectLlm)
  const selectModel = useLlmManagementStore((s) => s.selectModel)
  const addLlm = useLlmManagementStore((s) => s.addLlm)
  const deleteLlmCascade = useLlmManagementStore((s) => s.deleteLlmCascade)
  const addModel = useLlmManagementStore((s) => s.addModel)
  const deleteModel = useLlmManagementStore((s) => s.deleteModel)

  const [newProviderName, setNewProviderName] = useState<string>('')
  const [newProviderAlias, setNewProviderAlias] = useState<string>('')
  const [newModelName, setNewModelName] = useState<string>('')

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (item) {
      form.setFieldsValue({ modelId: null, instructions: item.instructions })
    }
  }, [form, item])

  useEffect(() => {
    void loadLlms()
  }, [loadLlms])

  const isInitialLoading = status === 'loading' && item === null
  const isError = status === 'error'

  useEffect(() => {
    // Keep the form model selection in sync with the selected provider.
    // When provider changes, models list changes too, so we must clear the model.
    form.setFieldsValue({ modelId: null })
    selectModel(null)
  }, [form, selectModel, selectedLlmId])

  useEffect(() => {
    const modelId = form.getFieldValue('modelId')
    if (modelId !== null) {
      return
    }

    const modelName = item?.model ?? null
    if (!modelName) {
      return
    }

    const matched = models.find((m) => m.name === modelName) ?? null
    if (!matched) {
      return
    }

    form.setFieldsValue({ modelId: matched.id })
    selectModel(matched.id)
  }, [form, item?.model, models, selectModel])

  const updatedAtLabel = useMemo(() => {
    const formatted = formatDateTime(item?.updatedAt ?? null)
    return formatted ?? t('common.notAvailable')
  }, [item?.updatedAt, t])

  const handleRetry = useCallback((): void => {
    void load({ force: true })
  }, [load])

  const handlePreventSelectMouseDown = useCallback((event: React.MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleProviderChange = useCallback(
    (llmId: number | null): void => {
      void selectLlm(llmId)
      form.setFieldsValue({ modelId: null })
    },
    [form, selectLlm],
  )

  const handleModelChange = useCallback(
    (modelId: number | null): void => {
      selectModel(modelId)
    },
    [selectModel],
  )

  const handleAddProvider = useCallback(async (): Promise<void> => {
    const name = newProviderName.trim()
    const alias = newProviderAlias.trim()
    if (!name || !alias) {
      message.error(t('llmConfig.messages.providerCreateInvalid'))
      return
    }

    try {
      const created = await addLlm({ name, alias })
      setNewProviderName('')
      setNewProviderAlias('')
      await selectLlm(created.id)
      form.setFieldsValue({ modelId: null })
      selectModel(null)
      message.success(t('llmConfig.messages.providerCreated'))
    } catch {
      message.error(t('llmConfig.messages.providerCreateFailed'))
    }
  }, [addLlm, form, newProviderAlias, newProviderName, selectLlm, selectModel, t])

  const handleDeleteProvider = useCallback(
    async (llmId: number): Promise<void> => {
      try {
        await deleteLlmCascade(llmId)
        form.setFieldsValue({ modelId: null })
        message.success(t('llmConfig.messages.providerDeleted'))
      } catch {
        message.error(t('llmConfig.messages.providerDeleteFailed'))
      }
    },
    [deleteLlmCascade, form, t],
  )

  const handleAddModel = useCallback(async (): Promise<void> => {
    const name = newModelName.trim()
    if (!name) {
      message.error(t('llmConfig.messages.modelCreateInvalid'))
      return
    }

    try {
      const created = await addModel({ name })
      setNewModelName('')
      form.setFieldsValue({ modelId: created.id })
      selectModel(created.id)
      message.success(t('llmConfig.messages.modelCreated'))
    } catch {
      message.error(t('llmConfig.messages.modelCreateFailed'))
    }
  }, [addModel, form, newModelName, selectModel, t])

  const handleDeleteModel = useCallback(
    async (modelId: number): Promise<void> => {
      const currentModelId = form.getFieldValue('modelId')
      try {
        await deleteModel(modelId)
        if (currentModelId === modelId) {
          form.setFieldsValue({ modelId: null })
          selectModel(null)
        }
        message.success(t('llmConfig.messages.modelDeleted'))
      } catch {
        message.error(t('llmConfig.messages.modelDeleteFailed'))
      }
    },
    [deleteModel, form, selectModel, t],
  )

  const providerOptions = useMemo(() => {
    return llms.map((llm) => ({
      value: llm.id,
      label: (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>
            {llm.name} ({llm.alias})
          </span>
          <Popconfirm
            title={t('llmConfig.confirmations.providerDelete')}
            okText={t('llmConfig.actions.confirm')}
            cancelText={t('llmConfig.actions.cancel')}
            onConfirm={() => void handleDeleteProvider(llm.id)}
          >
            <Button
              danger
              size="small"
              onMouseDown={handlePreventSelectMouseDown}
              onClick={handlePreventSelectMouseDown}
              disabled={isMutating}
            >
              {t('llmConfig.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    }))
  }, [handleDeleteProvider, handlePreventSelectMouseDown, isMutating, llms, t])

  const modelOptions = useMemo(() => {
    return models.map((m) => ({
      value: m.id,
      label: (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>{m.name}</span>
          <Popconfirm
            title={t('llmConfig.confirmations.modelDelete')}
            okText={t('llmConfig.actions.confirm')}
            cancelText={t('llmConfig.actions.cancel')}
            onConfirm={() => void handleDeleteModel(m.id)}
          >
            <Button
              danger
              size="small"
              onMouseDown={handlePreventSelectMouseDown}
              onClick={handlePreventSelectMouseDown}
              disabled={isMutating}
            >
              {t('llmConfig.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    }))
  }, [handleDeleteModel, handlePreventSelectMouseDown, isMutating, models, t])

  const handleSave = useCallback(
    async (values: LlmConfigFormValues): Promise<void> => {
      const selectedModelId = values.modelId
      const selectedModel = models.find((m) => m.id === selectedModelId) ?? null
      if (!selectedModel) {
        message.error(t('llmConfig.messages.saveFailed'))
        return
      }

      try {
        await save({ model: selectedModel.name, instructions: values.instructions })
        message.success(t('llmConfig.messages.saved'))
      } catch {
        message.error(t('llmConfig.messages.saveFailed'))
      }
    },
    [models, save, t],
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

        {llmsStatus === 'error' || modelsStatus === 'error' || mutationError ? (
          <Alert
            type="error"
            showIcon
            message={t('common.error')}
            description={llmsError ?? modelsError ?? mutationError ?? undefined}
          />
        ) : null}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSave}
          disabled={item === null || isSaving}
        >
          <Form.Item label={t('llmConfig.fields.provider')}>
            <Select
              value={selectedLlmId}
              onChange={handleProviderChange}
              loading={llmsStatus === 'loading'}
              options={providerOptions}
              allowClear
              placeholder={t('llmConfig.placeholders.providerSelect')}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 8px' }} direction="vertical">
                    <Input
                      value={newProviderName}
                      onChange={(e) => setNewProviderName(e.target.value)}
                      placeholder={t('llmConfig.placeholders.providerName')}
                      disabled={isMutating}
                    />
                    <Input
                      value={newProviderAlias}
                      onChange={(e) => setNewProviderAlias(e.target.value)}
                      placeholder={t('llmConfig.placeholders.providerAlias')}
                      disabled={isMutating}
                    />
                    <Button
                      type="primary"
                      onClick={() => void handleAddProvider()}
                      loading={isMutating}
                    >
                      {t('llmConfig.actions.addProvider')}
                    </Button>
                  </Space>
                </div>
              )}
            />
          </Form.Item>

          <Form.Item<LlmConfigFormValues>
            label={t('llmConfig.fields.model')}
            name="modelId"
            rules={[{ required: true, message: t('llmConfig.validation.modelRequired') }]}
          >
            <Select
              onChange={handleModelChange}
              options={modelOptions}
              disabled={selectedLlmId === null}
              loading={modelsStatus === 'loading'}
              allowClear
              placeholder={t('llmConfig.placeholders.modelSelect')}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 8px' }} direction="vertical">
                    <Input
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder={t('llmConfig.placeholders.modelName')}
                      disabled={isMutating || selectedLlmId === null}
                    />
                    <Button
                      type="primary"
                      onClick={() => void handleAddModel()}
                      loading={isMutating}
                      disabled={selectedLlmId === null}
                    >
                      {t('llmConfig.actions.addModel')}
                    </Button>
                  </Space>
                </div>
              )}
            />
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
