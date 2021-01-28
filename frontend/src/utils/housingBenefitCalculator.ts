interface housingBenefitInput {
  city: string
  totalMonthlyEarnings: number
  housingType: string
  totalFees: number
  ownLoanFee: number
  adultCount: number
  childCount: number
}

const calculateHousingBenefit = ({
  city,
  totalMonthlyEarnings,
  housingType,
  totalFees,
  ownLoanFee,
  adultCount,
  childCount,
}: housingBenefitInput) => {
  let acceptableCosts = totalFees - ownLoanFee * 0.27
  const isHelsinki = city.toLowerCase() === 'helsinki'
  const personCount = adultCount + childCount
  let maxAcceptableCosts
  switch (personCount) {
    case 1:
      maxAcceptableCosts = isHelsinki ? 521 : 504
      break
    case 2:
      maxAcceptableCosts = isHelsinki ? 754 : 723
      break
    case 3:
      maxAcceptableCosts = isHelsinki ? 960 : 912
      break
    case 4:
      maxAcceptableCosts = isHelsinki ? 1122 : 1064
      break
    default:
      const extraPeople = personCount - 4
      maxAcceptableCosts = isHelsinki ? 1122 + extraPeople * 140 : 1064 + extraPeople * 133
      break
  }
  if (housingType === 'Omakotitalo') {
    switch (personCount) {
      case 1:
        acceptableCosts += 96
        break
      case 2:
        acceptableCosts += 115
        break
      case 3:
        acceptableCosts += 145
        break
      case 4:
        acceptableCosts += 171
        break
      default:
        acceptableCosts += personCount * 53
        break
    }
  }

  let basicResponsibility =
    0.42 * (totalMonthlyEarnings - (606 + 100 * adultCount + 224 * childCount))

  basicResponsibility = basicResponsibility > 10 ? basicResponsibility : 0

  acceptableCosts = acceptableCosts > maxAcceptableCosts ? maxAcceptableCosts : acceptableCosts

  let monthlyBenefit = 0.8 * (acceptableCosts - basicResponsibility)

  return monthlyBenefit
}

export default calculateHousingBenefit
