import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Sidebar } from '../components/layout/Sidebar'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DeliveriesPage } from '../pages/DeliveriesPage'
import { ScheduledOrdersPage } from '../pages/ScheduledOrdersPage'
import { ProductsPage } from '../pages/ProductsPage'
import { RawMaterialsPage } from '../pages/RawMaterialsPage'
import { ProductionPage } from '../pages/ProductionPage'
import { StockPage } from '../pages/StockPage'
import { DestinationsPage } from '../pages/DestinationsPage'
import { UsersPage } from '../pages/UsersPage'
import type { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function ProtectedLayout({ children, requireOwner = false }: {
  children: ReactNode
  requireOwner?: boolean
}) {
  return (
    <ProtectedRoute requireOwner={requireOwner}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/deliveries" element={<ProtectedLayout><DeliveriesPage /></ProtectedLayout>} />
        <Route path="/scheduled-orders" element={<ProtectedLayout><ScheduledOrdersPage /></ProtectedLayout>} />
        <Route path="/products" element={<ProtectedLayout><ProductsPage /></ProtectedLayout>} />
        <Route path="/raw-materials" element={<ProtectedLayout><RawMaterialsPage /></ProtectedLayout>} />
        <Route path="/production" element={<ProtectedLayout><ProductionPage /></ProtectedLayout>} />
        <Route path="/stock" element={<ProtectedLayout><StockPage /></ProtectedLayout>} />
        <Route path="/destinations" element={<ProtectedLayout requireOwner><DestinationsPage /></ProtectedLayout>} />
        <Route path="/users" element={<ProtectedLayout requireOwner><UsersPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}