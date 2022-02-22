import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { api } from "../services/api";

interface Transaction {
    id: number,
    title: string,
    amount: number,
    type: string,
    category: string,
    createdAt: string;
}

//maneiras de criar uma nova tipagem com base em outra, omitindo os tipos desnecessários
type TransactionInput = Omit<Transaction, "id" | "createdAt">;

//maneira de criar uma nova tipagem, com base em outra, apenas com os tipos necessários
//type TransactionInput = Pick<Transaction, "title" | "amount" | "type" | "category">

interface TransactionsProviderprops {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transaction[],
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({children}: TransactionsProviderprops) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, [])

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date()
    })
    const { transaction } = response.data

    setTransactions([
      ...transactions,
      transaction
    ]);
  }

  return (
      <TransactionsContext.Provider value={{transactions, createTransaction}}>
          {children}
      </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}