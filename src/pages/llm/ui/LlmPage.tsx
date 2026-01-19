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

  const llms = useLlmManagementStore((s) => s.llms)
  const llmsStatus = useLlmManagementStore((s) => s.llmsStatus)
  const llmsError = useLlmManagementStore((s) => s.llmsError)
  const defaultLlmId = useLlmManagementStore((s) => s.defaultLlmId)
  const selectedLlmId = useLlmManagementStore((s) => s.selectedLlmId)
  const models = useLlmManagementStore((s) => s.models)
  const modelsStatus = useLlmManagementStore((s) => s.modelsStatus)
  const modelsError = useLlmManagementStore((s) => s.modelsError)
  const isMutating = useLlmManagementStore((s) => s.isMutating)
  const mutationError = useLlmManagementStore((s) => s.mutationError)
  const loadLlms = useLlmManagementStore((s) => s.loadLlms)
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
      form.setFieldsValue({ model: item.model, instructions: item.instructions })
    }
  }, [form, item])

  useEffect(() => {
    void loadLlms()
  }, [loadLlms])

  const isInitialLoading = status === 'loading' && item === null
  const isError = status === 'error'

  useEffect(() => {
    // Provider is locked to the default provider (first in list).
    // Keep selected model in sync with current config model name.
    const activeModel = item?.model ?? null
    const matched = activeModel ? (models.find((m) => m.name === activeModel) ?? null) : null
    selectModel(matched?.id ?? null)
  }, [item?.model, models, selectModel, selectedLlmId])

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

  // Provider selection is locked (first provider in list).
  const handleProviderChange = useCallback((): void => undefined, [])

  const handleModelChange = useCallback(
    (modelName: string): void => {
      const matched = models.find((m) => m.name === modelName) ?? null
      selectModel(matched?.id ?? null)
    },
    [models, selectModel],
  )

  const handleAddProvider = useCallback(async (): Promise<void> => {
    const name = newProviderName.trim()
    const alias = newProviderAlias.trim()
    if (!name || !alias) {
      message.error(t('llmConfig.messages.providerCreateInvalid'))
      return
    }

    try {
      await addLlm({ name, alias })
      setNewProviderName('')
      setNewProviderAlias('')
      message.success(t('llmConfig.messages.providerCreated'))
    } catch {
      message.error(t('llmConfig.messages.providerCreateFailed'))
    }
  }, [addLlm, newProviderAlias, newProviderName, t])

  const handleDeleteProvider = useCallback(
    async (llmId: number): Promise<void> => {
      // Default provider is not changeable, so deleting it is not allowed.
      if (llmId === defaultLlmId) {
        return
      }

      try {
        await deleteLlmCascade(llmId)
        message.success(t('llmConfig.messages.providerDeleted'))
      } catch {
        message.error(t('llmConfig.messages.providerDeleteFailed'))
      }
    },
    [defaultLlmId, deleteLlmCascade, t],
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
      form.setFieldsValue({ model: created.name })
      selectModel(created.id)
      message.success(t('llmConfig.messages.modelCreated'))
    } catch {
      message.error(t('llmConfig.messages.modelCreateFailed'))
    }
  }, [addModel, form, newModelName, selectModel, t])

  const handleDeleteModel = useCallback(
    async (modelId: number): Promise<void> => {
      const activeModelName = item?.model ?? null
      const model = models.find((m) => m.id === modelId) ?? null
      if (activeModelName !== null && model?.name === activeModelName) {
        return
      }

      try {
        await deleteModel(modelId)
        message.success(t('llmConfig.messages.modelDeleted'))
      } catch {
        message.error(t('llmConfig.messages.modelDeleteFailed'))
      }
    },
    [deleteModel, item?.model, models, t],
  )

  const providerOptions = useMemo(() => {
    return llms.map((llm) => ({
      value: llm.id,
      disabled: defaultLlmId !== null ? llm.id !== defaultLlmId : false,
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
            disabled={isMutating || llm.id === defaultLlmId}
          >
            <Button
              danger
              size="small"
              onMouseDown={handlePreventSelectMouseDown}
              onClick={handlePreventSelectMouseDown}
              disabled={isMutating || llm.id === defaultLlmId}
            >
              {t('llmConfig.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    }))
  }, [defaultLlmId, handleDeleteProvider, handlePreventSelectMouseDown, isMutating, llms, t])

  const modelOptions = useMemo(() => {
    const activeModelName = item?.model ?? null

    const options: Array<{
      readonly value: string
      readonly label: ReactElement
      readonly disabled?: boolean
    }> = models.map((m) => ({
      value: m.name,
      label: (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>{m.name}</span>
          <Popconfirm
            title={t('llmConfig.confirmations.modelDelete')}
            okText={t('llmConfig.actions.confirm')}
            cancelText={t('llmConfig.actions.cancel')}
            onConfirm={() => void handleDeleteModel(m.id)}
            disabled={isMutating || (activeModelName !== null && m.name === activeModelName)}
          >
            <Button
              danger
              size="small"
              onMouseDown={handlePreventSelectMouseDown}
              onClick={handlePreventSelectMouseDown}
              disabled={isMutating || (activeModelName !== null && m.name === activeModelName)}
            >
              {t('llmConfig.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    }))

    // Ensure the select can always display the config model, even if it is not present
    // in the models list for the selected provider.
    if (activeModelName && !options.some((o) => o.value === activeModelName)) {
      options.unshift({
        value: activeModelName,
        label: <span>{activeModelName}</span>,
        disabled: true,
      })
    }

    return options
  }, [handleDeleteModel, handlePreventSelectMouseDown, isMutating, item?.model, models, t])

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
              value={defaultLlmId ?? selectedLlmId}
              onChange={handleProviderChange}
              loading={llmsStatus === 'loading'}
              options={providerOptions}
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
            name="model"
            rules={[{ required: true, message: t('llmConfig.validation.modelRequired') }]}
          >
            <Select
              onChange={handleModelChange}
              options={modelOptions}
              disabled={selectedLlmId === null}
              loading={modelsStatus === 'loading'}
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
