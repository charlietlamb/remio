'use client'

import DashboardContentHeader from '../header/dashboard-content-header'
import ClientCardCreate from './client-create-card'
import ClientsChart from './clients-chart'
import ClientsManageCard from './clients-manage-card'
import { ClientsChart as ClientsChartType } from './client-types'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  clientsDateRange,
  clientsChartData,
} from '@remio/design-system/atoms/dashboard/clients/clients-atoms'
import { useEffect } from 'react'
import { getClientsChartData } from '@remio/design-system/actions/clients/get-clients-chart-data'

export default function Clients({
  chartData,
}: {
  chartData: ClientsChartType
}) {
  const dateRange = useAtomValue(clientsDateRange)
  const setClientsChartData = useSetAtom(clientsChartData)

  useEffect(() => {
    setClientsChartData(chartData)
  }, [chartData])

  useEffect(() => {
    async function fetchClients() {
      if (!dateRange) return

      const clientChartData = await getClientsChartData(
        dateRange?.from ?? new Date(),
        dateRange?.to ?? new Date()
      )

      setClientsChartData(clientChartData)
    }
    fetchClients()
  }, [dateRange])

  return (
    <div className="flex flex-col divide-y">
      <DashboardContentHeader
        title="Clients"
        subtitle="View your client activity - add, edit or remove clients."
      />
      <div className="p-4 gap-4 grid grid-cols-2">
        <ClientsChart className="col-span-2" />
        <ClientsManageCard />
        <ClientCardCreate />
      </div>
    </div>
  )
}
