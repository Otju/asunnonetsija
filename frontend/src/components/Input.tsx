const Input: React.FC<{
  value: number
  displayName: string
  handleChange: (e?: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ handleChange, displayName, value }) => {
  return (
    <label>
      {displayName}
      <input type="number" className="input" onChange={handleChange} value={value}></input>
    </label>
  )
}

export default Input
