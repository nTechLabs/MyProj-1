import { Layout, Typography } from 'antd'
import AppRoutes from './routes/AppRoutes'
import './App.css'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#001529', padding: '0 20px' }}>
        <Title level={2} style={{ color: 'white', margin: '14px 0' }}>
          React Vite + Zustand + Ant Design
        </Title>
      </Header>
      
      <Content>
        <AppRoutes />
      </Content>
    </Layout>
  )
}

export default App
