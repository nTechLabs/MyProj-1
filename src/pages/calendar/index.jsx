import React, { useState } from 'react'
import { Tabs, ConfigProvider } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import CalendarList from './CalendarList'
import '../../styles/pages.css'
import './calendar.css'

/**
 * Calendar 메인 페이지 컴포넌트
 * React Query + Zustand + Ant Design Mobile을 사용한 캘린더 관리 시스템
 * Monthly, 2Weekly, Weekly, 5Days, Daily 5개의 탭으로 구성
 */
const CalendarPage = () => {
  const [activeTab, setActiveTab] = useState('monthly')

  const tabItems = [
    {
      key: 'monthly',
      label: (
        <span className="calendar-tab-label">
          <CalendarOutlined className="calendar-tab-icon" />
          월간
        </span>
      ),
      children: <CalendarList viewType="monthly" />
    },
    {
      key: '2weekly',
      label: (
        <span className="calendar-tab-label">
          <CalendarOutlined className="calendar-tab-icon" />
          2주간
        </span>
      ),
      children: <CalendarList viewType="2weekly" />
    },
    {
      key: 'weekly',
      label: (
        <span className="calendar-tab-label">
          <CalendarOutlined className="calendar-tab-icon" />
          주간
        </span>
      ),
      children: <CalendarList viewType="weekly" />
    },
    {
      key: '5days',
      label: (
        <span className="calendar-tab-label">
          <CalendarOutlined className="calendar-tab-icon" />
          5일간
        </span>
      ),
      children: <CalendarList viewType="5days" />
    },
    {
      key: 'daily',
      label: (
        <span className="calendar-tab-label">
          <CalendarOutlined className="calendar-tab-icon" />
          일간
        </span>
      ),
      children: <CalendarList viewType="daily" />
    }
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#722ed1',
          borderRadius: 8,
        }
      }}
    >
      <div className="calendar-page-container">
        <div className="calendar-page-header">
          <CalendarOutlined className="calendar-page-icon" />
          <h1 className="calendar-page-title">캘린더 관리</h1>
          <p className="calendar-page-subtitle">React Query + Zustand + Ant Design Mobile</p>
        </div>

        <div className="calendar-tabs-container">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="calendar-tabs"
            size="large"
            centered
          />
        </div>
      </div>
    </ConfigProvider>
  )
}

export default CalendarPage
