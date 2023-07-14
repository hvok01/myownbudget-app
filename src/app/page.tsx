'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import moment from 'moment'

export default function Home() {
  //npm run dev
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [disableForm, setDisabledForm] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState('');

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  useEffect(() => {
    if(name.length > 0 && datetime.length > 0 && description.length > 0) {
      setDisabledForm(false);
    }
  }, [name, datetime, description])

  const getTransactions = async () => {
    const URI = `${process.env.NEXT_PUBLIC_API_URI}/transactions`;

    //get is default for fetch, so is not required
    const response = await fetch(URI);
    return await response.json();
  }

  const addNewTransaction = (ev: any) => {
    ev.preventDefault();
    //rerview why this dont work with process.env
    const URI = `${process.env.NEXT_PUBLIC_API_URI}/transaction`;
    const price = name.split(" ")[0];

    fetch(URI, {
      method: "POST",
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        price,
        name: name.substring(price.length+1),
        datetime, 
        description
      })
    }).then(response => {
      response.json().then(jsonResp => {
        setName("");
        setDatetime("");
        setDescription("");
        getTransactions().then(setTransactions);
      });
    })

  }

  let balance = 0;
  let allTransactions: any[] = transactions;
  for(const transaction of allTransactions) {
    balance = balance + transaction.price
  }

  const balanceStr = balance.toFixed(2);
  const balanceTotal = balanceStr.split('.')[0];
  const fractions = balanceStr.split('.')[1];

  return (
    <main className={styles.main}>
      <div>
        <div>
          <h1>
            Start here adding your budget!
          </h1>
          <div>
            <input type="text" value={monthlyBudget} onChange={ev => setMonthlyBudget(ev.target.value)} placeholder={"$2500"}/>
            <button>
              Save
            </button>
          </div>
        </div>
      </div>
      <h1 className={styles.priceBudget}>${balanceTotal}<span>{fractions}</span></h1>
      <form className={styles.form} onSubmit={addNewTransaction}>
        <div className={styles.basic}>
          <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder={"+200 new samsung tv"}/>
          <input type="datetime-local" value={datetime} onChange={ev => setDatetime(ev.target.value)} />
        </div>
        <div className={styles.descrption}>
          <input type="text" placeholder={"what happened"} value={description} onChange={ev => setDescription(ev.target.value)}/>
        </div>
        <button type='submit' disabled={disableForm}>
          Add new transaction
        </button>
      </form>
      <div className={styles.transactions}>
        {
          transactions.length > 0 && transactions.map((transaction: any, key) => {
            return (
              <div className={styles.transaction} key={key}>
                <div className={styles.left}>
                  <div className={styles.name}>{transaction.name}</div>
                  <div className={styles.description}>{transaction.description}</div>
                </div>
                <div className={styles.right}>
                    <div className={`${styles.price} ${transaction.price > 0 ? styles.green : styles.red}`}>{transaction.price}</div>
                  <div className={styles.datetime}>{moment(transaction.datetime).format("LL")}</div>
                </div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}