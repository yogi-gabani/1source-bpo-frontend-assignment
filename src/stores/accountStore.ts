import { create } from 'zustand'

export type Account = {
  id: string
  name: string
}

type AccountState = {
  accounts: Account[]
  currentAccountId: string | null
}

type AccountActions = {
  setAccounts: (accounts: Account[]) => void
  setCurrentAccount: (accountId: string) => void
}

export type AccountStore = AccountState & AccountActions

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: [
    { id: 'riverside', name: 'Riverside Logistics' },
    { id: 'summit', name: 'Summit Analytics' },
    { id: 'horizon', name: 'Horizon Media' },
  ],
  currentAccountId: 'riverside',

  setAccounts: (accounts) =>
    set(() => ({
      accounts,
      currentAccountId: accounts.length > 0 ? accounts[0].id : null,
    })),

  setCurrentAccount: (accountId) =>
    set(() => ({
      currentAccountId: accountId,
    })),
}))

