'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '../ui/button'

export function ComutadorTema() {
  const { setTheme } = useTheme()

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="block justify-items-center rounded-xl dark:hidden"
        onClick={() => setTheme('dark')}
      >
        <Sun className="size-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden justify-items-center rounded-xl dark:block"
        onClick={() => setTheme('light')}
      >
        <Moon className="size-5" />
      </Button>
    </div>
  )
}
