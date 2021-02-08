import Slider from './Slider'
import { LoanSettings as LoanSettingsType } from '../../../types'

const LoanSettings: React.FC<{
  loanVariables: LoanSettingsType | undefined
  setLoanVariables: Function
}> = ({ loanVariables, setLoanVariables }) => {
  type LoanVariable = 'loanYears' | 'yearlyIntrest' | 'savings'

  interface inputType {
    field: LoanVariable
    displayName: string
    defaultMax: number
    defaultValue: number
    unit: string
    defaultMin?: number
    step?: number
  }

  const inputTypes: inputType[] = [
    {
      field: 'loanYears',
      displayName: 'Laina-aika',
      defaultMax: 30,
      defaultValue: 20,
      unit: 'v',
      defaultMin: 10,
    },
    {
      field: 'yearlyIntrest',
      displayName: 'Korko',
      defaultMax: 10,
      defaultValue: 1.5,
      unit: '%',
      step: 0.5,
    },
    {
      field: 'savings',
      displayName: 'Säästöt',
      defaultMax: 1000000,
      defaultValue: 0,
      unit: '€',
      step: 100,
    },
  ]

  return (
    <>
      {inputTypes.map(({ field, ...props }: inputType) => {
        const handleChange = (values: readonly number[]) => {
          const newLoanVariables = { ...loanVariables }
          newLoanVariables[field] = values[0]
          setLoanVariables(newLoanVariables)
        }
        return (
          <Slider
            handleChange={handleChange}
            {...props}
            key={props.displayName}
            notRange
            value={loanVariables && loanVariables[field]}
          />
        )
      })}
    </>
  )
}

export default LoanSettings
