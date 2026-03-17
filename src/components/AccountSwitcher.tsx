import React from 'react'
import { useAccountStore } from '../stores/accountStore'
import CompanyDashboard from './CompanyDashboard'
import { Card } from './Card'

/**
 * Multi-tenant Account Switcher.
 * Displays available accounts and updates global account context via Zustand.
 */
const AccountSwitcher: React.FC = () => {
  const accounts = useAccountStore((s) => s.accounts)
  const currentAccountId = useAccountStore((s) => s.currentAccountId)
  const setCurrentAccount = useAccountStore((s) => s.setCurrentAccount)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentAccount(e.target.value)
  }

  const currentAccount = accounts.find((a) => a.id === currentAccountId) ?? null

  return (
    <Card>
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-[color:var(--app-accent-strong)]">
          Account Switcher
        </h2>
        <p className="text-xs text-[color:var(--app-text-muted)]">
          Select a company to switch the active account context (stored in a
          global Zustand store).
        </p>
      </header>

      <div className="flex flex-col gap-3 text-sm text-[color:var(--app-text)]">
        <label className="flex flex-col gap-1 text-xs text-[color:var(--app-text-muted)]">
          <span>Active account</span>
          <select
            value={currentAccountId ?? ''}
            onChange={handleChange}
            className="h-9 rounded-md border border-[color:var(--app-border-strong)] bg-[color:var(--app-surface-subtle)] px-2 text-sm text-[color:var(--app-text)] outline-none focus:border-[color:var(--app-accent)] focus:ring-1 focus:ring-[color:var(--app-accent)]"
          >
            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
              >
                {account.name}
              </option>
            ))}
          </select>
        </label>

        {currentAccount ? (
          <CompanyDashboard account={currentAccount} />
        ) : (
          <div className="rounded-md border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-subtle)] px-3 py-2 text-xs text-[color:var(--app-text-muted)]">
            No active account selected.
          </div>
        )}
      </div>
    </Card>
  )
}

export default AccountSwitcher

