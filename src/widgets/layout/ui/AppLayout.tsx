import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Layout, Menu, theme as antdTheme, Typography } from 'antd'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import styles from './AppLayout.module.css'

export function AppLayout(): ReactElement {
  const { t } = useTranslation()
  const { token } = antdTheme.useToken()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const selectedKey = location.pathname.startsWith('/settings')
    ? '/settings'
    : location.pathname.startsWith('/filters')
      ? '/filters'
      : '/dashboard'

  const menuItems = useMemo(() => {
    return [
      { key: '/dashboard', label: t('nav.dashboard') },
      { key: '/filters', label: t('nav.filters') },
      { key: '/settings', label: t('nav.settings') },
    ]
  }, [t])

  return (
    <Layout className={styles.root}>
      <Layout.Header
        className={styles.header}
        style={{
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Button
          aria-label={t('nav.menu')}
          icon={<MenuOutlined />}
          onClick={() => setMenuOpen(true)}
          type="text"
          style={{ color: token.colorText }}
        />
        <Typography.Title className={styles.brand} level={5} style={{ color: token.colorText }}>
          {t('common.appName')}
        </Typography.Title>
      </Layout.Header>

      <Layout.Content className={styles.content}>
        <Outlet />
      </Layout.Content>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        title={t('nav.menu')}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(e) => {
            setMenuOpen(false)
            navigate(e.key)
          }}
        />
      </Drawer>
    </Layout>
  )
}
