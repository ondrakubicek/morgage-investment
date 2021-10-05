import React, { useState, useEffect } from 'react'
import './App.css'
import ResultChart from './resultChart'
import xirr from 'xirr'
import Slider from '@material-ui/core/Slider';

import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


function App() {
  const numberOfMonths = 12;

  const [loanYears, setLoanYears] = useState(30);
  const [investmentYears, setInvestmentYears] = useState(20);

  const [priceOfProperty, setPriceOfProperty] = useState(2000000)
  const [ownResources, setOwnResources] = useState(0)
  const [amountOfLoan, setAmountOfLoan] = useState(2000000)
  const [interest, setInterest] = useState(3)
  const [evaluation, setEvaluation] = useState(5)
  const [monthlyDeposit, setMonthlyDeposit] = useState(2000)
  const [payment, setPayment] = useState(0)
  const [loanChartData, setLoanChartData] = useState([])


  const yearMarks = () => {
    const marks = []
    for (let z = 5; z <= 30; z++) {
      marks.push(
        {
          value: z,
          label: z % 5 === 0 ? z === 30 ? `${z} let`: z : '',
        }
      )
    }
    return marks
  }

  const n = () => {
    return numberOfMonths * loanYears
  }

  const i = () => {
    return interest / 100 / numberOfMonths
  }

  const ny = () => {
    return 1 / (1 + i())
  }

  const getPayment = () => {
    return i() * amountOfLoan / (1 - Math.pow(ny(), n()))
  }


  useEffect(() => {
    setPayment(getPayment())
  })


  const loanData = (yearonly = true) => {
    const data = []
    let debtStatus = amountOfLoan
    for (let z = 0; z <= n(); z++) {
      const interest = debtStatus * i()
      const death = payment - interest
      if (z > 0) debtStatus = debtStatus - death;
      if (debtStatus < 0) debtStatus = 0
      const monthData = {
        payment: payment,
        interest: interest,
        death: payment - interest,
        debtStatus: debtStatus,
        month: z
      }
      if (z % 12 === 0 && yearonly) {
        data.push(monthData)
      } else if (!yearonly) {
        data.push(monthData)
      }
    }
    return data

  }



  const investementData = (yearonly = true) => {
    const data = []
    let total = 0;
    let vynos = 0;
    for (let z = 0; z <= n(); z++) {
      //610,16×((1+(4,5÷100))^(1÷12)−1)
      let vklad = monthlyDeposit * 1 // 0.975
      let hodnota = (vklad + total) * (Math.pow(1 + evaluation / 100, (1 / 12)) - 1)
      total = total + hodnota + vklad
      const monthData = {
        total: total,
      }
      if (z % 12 === 0 && yearonly) {
        data.push(monthData)
      } else if (!yearonly) {
        data.push(monthData)
      }
    }
    return data;
  }

  const overc = () => {
    const ld = loanData(false)
    const id = investementData(false)

    for (let z = 0; z <= n(); z++) {
      if (id[z]?.total > ld[z]?.debtStatus) {
        const r = Math.floor(z / 12) + ". rok "
        const m = (z % 12) > 0 ? (z % 12) + ". měsíc" : ""
        return r + m
      }
    }
  }



  /*
  Cena nemovitosti: 2 000 000 Kč Vlastní zdroje: 0 Kč
  Výše úvěru: 2 000 000 Kč Splatnost: 30 let
  Úrok: 3 % Měsíční vklad: 2 000 Kč
  Zhodnocení: 5 % Délka investice: 30 let
  */
  return (
    <div className="App">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="standard-adornment-amount">Výše úvěru</InputLabel>
            <Input
              id="standard-adornment-amount"
              type="number"
              placeholder="1000000"
              value={amountOfLoan}
              inputProps={{ min: "0", step: "5000" }}
              onChange={(changeEvent) => setAmountOfLoan(changeEvent.target.value)}
              endAdornment={<InputAdornment position="end">Kč</InputAdornment>}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography id="label" className="MuiFormLabel-root MuiInputLabel-shrink">Splatnost</Typography>
            <Slider
              value={loanYears}
              aria-labelledby="discrete-slider-always"
              step={1}
              min={5}
              max={30}
              valueLabelDisplay="on"
              marks={yearMarks()}
              onChange={(event, newValue) => setLoanYears(newValue)}
              endAdornment={<InputAdornment position="end"></InputAdornment>}

            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="standard-adornment-amount">Úrok</InputLabel>
            <Input
              id="standard-adornment-amount"
              type="number"
              placeholder="1.5"
              inputProps={{ min: "0.1", max: "10", step: "0.1" }}
              value={interest}
              onChange={(changeEvent) => setInterest(changeEvent.target.value)}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="standard-adornment-amount">Zhodnocení</InputLabel>
            <Input
              id="standard-adornment-amount"
              type="number"
              placeholder="1.5"
              inputProps={{ min: "0.1", max: "10", step: "0.1" }}
              value={evaluation}
              onChange={(changeEvent) => setEvaluation(changeEvent.target.value)}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="standard-adornment-amount">Měsíční vklad</InputLabel>
            <Input
              id="standard-adornment-amount"
              type="number"
              placeholder="2000"
              inputProps={{ min: "0", step: "100" }}
              value={monthlyDeposit}
              onChange={(changeEvent) => setMonthlyDeposit(changeEvent.target.value)}
              endAdornment={<InputAdornment position="end">Kč</InputAdornment>}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={6}>Splátka:</Grid>
            <Grid item xs={6}> <strong>{new Intl.NumberFormat('cs-CZ').format(Math.floor(payment))} Kč / měsíc</strong></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={6}>Celkem zaplatíte:</Grid>
            <Grid item xs={6}><strong>{new Intl.NumberFormat('cs-CZ').format(Math.floor(payment * n()))} Kč / {loanYears} let</strong></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={6}>Hodnota investice převýší dluh&nbsp;</Grid>
            <Grid item xs={6}><strong>{overc()}</strong></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ResultChart
            className='form-group result-chart'
            loanChartData={loanData()}
            investementData={investementData()}
          />
        </Grid>
      </Grid>

    </div>
  );
}

export default App;