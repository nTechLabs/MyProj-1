import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages'
import UsersPage from '../pages/users/UsersPage'
import UsersDetail from '../pages/users/UsersDetail'
import CounterPage from '../pages/counter/CounterPage'
import { ROUTES } from './routes'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.USERS} element={<UsersPage />} />
      <Route path={ROUTES.USER_DETAIL} element={<UsersDetail />} />
      <Route path={ROUTES.COUNTER} element={<CounterPage />} />
    </Routes>
  )
}

export default AppRoutes
