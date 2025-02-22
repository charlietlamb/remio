'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@remio/design-system/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@remio/design-system/components/ui/chart'
import { getDashboardCombinedData } from '@remio/design-system/lib/dashboard/get-dashboard-combined-data'
import {
  dashboardDataAtom,
  overviewDateRange,
} from '@remio/design-system/atoms/dashboard/overview/overview-atoms'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  clients: {
    label: 'Clients',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function OverviewChart() {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>('revenue')

  const dashboardData = useAtomValue(dashboardDataAtom)
  const dateRange = useAtomValue(overviewDateRange)

  const chartData = useMemo(
    () => getDashboardCombinedData(dashboardData, dateRange),
    [dashboardData, dateRange]
  )

  const total = useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + Number(curr.revenue), 0),
      clients: chartData.reduce((acc, curr) => acc + Number(curr.clients), 0),
    }),
    [chartData]
  )
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartConfig[activeChart].label}</CardTitle>
          <CardDescription>
            Showing total {chartConfig[activeChart].label.toLowerCase()} for the
            selected date range
          </CardDescription>
        </div>
        <div className="flex">
          {['revenue', 'clients'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {key === 'revenue' ? '£' : ''}
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
