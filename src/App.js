import styles from './App.module.scss'
import Select from 'react-select'
import { useEffect, useState } from 'react'

const cryptoOptions = [
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'LTC', label: 'Litecoin' }
]

const fiatOptions = [
  { value: 'UAH', label: 'Privat UAH' },
]

const App = () => {
  const [sellOptions, setSellOptions] = useState(cryptoOptions)
  const [buyOptions, setBuyOptions] = useState(fiatOptions)
  const [sellChosenOption, setSellChosenOption] = useState(cryptoOptions[0])
  const [buyChosenOption, setBuyChosenOption] = useState(fiatOptions[0])
  const [exchangeRate, setExchangeRate] = useState(1)
  const [sellAmount, setSellAmount] = useState('')
  const [address, setAddress] = useState('')
  const [userName, setUserName] = useState('')
  const [userSurname, setUserSurname] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [networkOptions, setNetworkOptions] = useState([])
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [networksAreLoading, setNetworksAreLoading] = useState(false)

  const switchOptions = () => {
    setSellOptions(buyOptions)
    setBuyOptions(sellOptions)
    setSellChosenOption(buyChosenOption)
    setBuyChosenOption(sellChosenOption)
  }

  const getExchangeRate = async () => {
    const res = await fetch(`https://crypto-info-363614.oa.r.appspot.com/price?firstUnit=${sellChosenOption.value}&secondUnit=${buyChosenOption.value}`)
    const data = await res.json()

    setExchangeRate(+data.price)
  }

  const getNetworkOptions = async () => {
    setNetworksAreLoading(true)

    const operation = sellOptions === fiatOptions ? 'sell' : 'buy'
    const crypto = sellOptions === fiatOptions ? buyChosenOption.value : sellChosenOption.value

    const res = await fetch(`https://crypto-exchanger-363709.lm.r.appspot.com/networks?coinName=${crypto}&operation=${operation}`)
    const data = await res.json()
    const options = data.map(({ network }) => ({ label: network, value: network }))

    setNetworkOptions(options)
    setSelectedNetwork(options[0])
    setNetworksAreLoading(false)
  }

  const submitOrder = async () => {
    const res = await fetch(
      'https://crypto-exchanger-363709.lm.r.appspot.com/submit',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          unit_to_sell: sellChosenOption.value,
          unit_to_buy: buyChosenOption.value,
          amount_to_sell: sellAmount,
          amount_to_buy: sellAmount * exchangeRate,
          network: selectedNetwork.value,
          address,
          name: userName,
          surname: userSurname,
          email: userEmail
        })
      },
      
    )

    const data = await res.text()

    if (data === 'Exchange order created successfully!') {
      alert('Exchange order created successfully!')
    } else {
      alert('Error! Your order has not been created. Try later')
    }
  }

  useEffect(() => {
    getExchangeRate()
    getNetworkOptions()
  }, [sellChosenOption, buyChosenOption])

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.selectsWrapper}>
          <div>
            <Select
              options={sellOptions}
              value={sellChosenOption}
              onChange={value => setSellChosenOption(value)}
              isDisabled={sellOptions === fiatOptions}
            />
            <input
              type="number"
              value={sellAmount}
              onChange={e => setSellAmount(e.target.value)}
            />
          </div>

          <div>
            <button onClick={switchOptions}>swap</button>
          </div>

          <div>
            <Select
              options={buyOptions}
              value={buyChosenOption}
              onChange={value => setBuyChosenOption(value)}
              isDisabled={buyOptions === fiatOptions}
            />
            <input
              disabled
              type="number"
              value={sellAmount * exchangeRate}
            />
          </div>
        </div>

        <div>
          <Select
            options={networkOptions}
            value={selectedNetwork}
            onChange={value => setSelectedNetwork(value)}
            isDisabled={networksAreLoading}
          />
        </div>

        <div>
          {sellOptions === fiatOptions
            ? (
              <input
                className={styles.cryptoAddressField}
                placeholder={buyChosenOption.label + ' mainnet address'}
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            ) : (
              <input
                className={styles.cardNumberField}
                placeholder="card number"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            )
          }
        </div>

        <div>
          <input
            placeholder="Your name"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Your surname"
            value={userSurname}
            onChange={e => setUserSurname(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Your email"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
          />
        </div>
        
        <div>
          <button
            onClick={submitOrder}
          >
            Создать заявку
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
