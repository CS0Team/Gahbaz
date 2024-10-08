import React, { Component, Suspense, createContext, useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import getRoutes from './routes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigation,
} from 'react-router-dom'
import './scss/style.scss'
import { ModalsProvider } from '@mantine/modals'
import { MantineProvider, createEmotionCache } from '@mantine/core'
import rtlPlugin from 'stylis-plugin-rtl'
import { Notifications } from '@mantine/notifications'
import 'dayjs/locale/ar'
import dayjs from 'dayjs'

dayjs.locale('ar') // use loaded locale globally
import { DatesProvider } from '@mantine/dates'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

export const router = createBrowserRouter(getRoutes(queryClient))

const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
})


function App() {
 
  return (

      <QueryClientProvider client={queryClient}>
        {/* <CloudinaryContext cloudName="ddng3kwfw"> */}
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={rtlCache}
          theme={{
            dir: 'rtl',

            fontFamily: 'Cairo',
            colors: {
              brand: [
                '#f2eaff',
                '#d4c4f0',
                '#b69fe2',
                '#9979d4',
                '#7b52c6',
                '#6239ad',
                '#4c2c87',
                '#361e62',
                '#21123d',
                '#0d041a',
              ],
            },
            primaryColor: 'brand',
            primaryShade: 4,
          }}
        >
          <DatesProvider settings={{ locale: 'ar', firstDayOfWeek: 6, weekendDays: [4, 5] }}>
            <ModalsProvider labels={{ confirm: 'حفظ', cancel: 'إلغاء' }}>
              <Suspense fallback={loading}>
                <RouterProvider router={router} />
              </Suspense>{' '}
            </ModalsProvider>
          </DatesProvider>
          <Notifications />
        </MantineProvider>
        {/* </CloudinaryContext> */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
  )
}

export default App
