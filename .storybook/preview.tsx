import type { Preview } from '@storybook/react-vite'
import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'

const theme = createTheme()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <Story />
        </SnackbarProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;