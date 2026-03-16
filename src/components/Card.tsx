import React from 'react'

type CardProps = React.PropsWithChildren<{
  className?: string
}>

export const Card: React.FC<CardProps> = ({ className = '', children }) => {
  return (
    <section
      className={`rounded-2xl border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface)]/95 p-4 shadow-md shadow-indigo-100/60 ${className}`}
    >
      {children}
    </section>
  )
}

