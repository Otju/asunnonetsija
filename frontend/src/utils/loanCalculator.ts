interface monthlyFeeInputs {
  loanYears?: number
  yearlyIntrest?: number
  loanAmount: number
  savings?: number
}

export const calculateMonthlyFee = ({
  loanYears = 20,
  yearlyIntrest = 1.5,
  loanAmount,
  savings = 0,
}: monthlyFeeInputs): number => {
  const loanMonths = loanYears * 12
  const monthlyIntrest = yearlyIntrest / 100 / 12
  const amountToPay = loanAmount - savings > 0 ? loanAmount - savings : 0

  const monthlyFee =
    ((monthlyIntrest + 1) ** loanMonths * (monthlyIntrest * amountToPay)) /
    ((monthlyIntrest + 1) ** loanMonths - 1)

  return monthlyFee
}
export const calculateAllMonhlyFees = () => {}
