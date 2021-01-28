import { calculateMonthlyFee } from './loanCalculator'
import { Renovation } from '../../../types'
import apartmentInfos from '../assets/apartmentInfos.json'
import {
  IoHomeOutline,
  IoPricetagOutline,
  IoSquareOutline,
  IoLocationOutline,
  IoCashOutline,
  IoLinkOutline,
  IoHammerOutline,
  IoHourglassOutline,
} from 'react-icons/io5'
import { ParsedApartmentInfo } from '../../../types'
import formatCurrency from './currencyFormatter'
import calculateHousingBenefit from './housingBenefitCalculator'

export const getApartmentInfos = () => {
  return apartmentInfos.map((info) => {
    const loanFee = info.loanFee || 0
    const maintananceFee = info.maintananceFee || 0
    const otherFees = (info.waterFee || 0) + (info.otherFees || 0)
    const ownLoanFee = info.sellingPrice
      ? calculateMonthlyFee({ loanAmount: info.sellingPrice })
      : 0
    const totalFees = loanFee + maintananceFee + ownLoanFee + otherFees
    const bathroomRenovation: Renovation = info.bigRenovations[0]
    if (bathroomRenovation) {
      bathroomRenovation.monthlyCost = calculateMonthlyFee({ loanAmount: bathroomRenovation.cost })
    }
    const address = info.address.split(',')[0]
    const parts = info.address.split(' ')
    const city = parts[parts.length - 1]

    const housingBenefit = calculateHousingBenefit({
      city,
      totalMonthlyEarnings: 1000,
      housingType: info.houseType || '',
      totalFees,
      ownLoanFee,
      adultCount: 1,
      childCount: 0,
    })

    return {
      ...info,
      address,
      city,
      loanFee,
      maintananceFee,
      otherFees,
      ownLoanFee,
      totalFees,
      bathroomRenovation,
      housingBenefit,
    }
  })
}

export const getInfoBoxes = (info: ParsedApartmentInfo) => {
  return [
    {
      header: 'Osoite',
      info: info.address,
      icon: IoHomeOutline,
    },
    {
      header: 'Asuinalue',
      info: `${info.district}, ${info.city}`,
      icon: IoLocationOutline,
    },
    {
      header: 'Myyntihinta',
      info: formatCurrency(info.sellingPrice || 0, -3),
      icon: IoPricetagOutline,
    },
    {
      header: 'Pinta-ala',
      info: `${info.sqrMeters} m²`,
      icon: IoSquareOutline,
    },
    {
      header: 'Rahoitusvastike',
      info: `${formatCurrency(info.loanFee)}/kk`,
      icon: IoCashOutline,
    },
    {
      header: 'Hoitovastike',
      info: `${formatCurrency(info.maintananceFee)}/kk`,
      icon: IoCashOutline,
    },
    {
      header: 'Muut kustannukset',
      info: `${formatCurrency(info.otherFees)}/kk`,
      icon: IoCashOutline,
    },
    {
      header: 'Asuntolaina',
      info: `${formatCurrency(info.ownLoanFee)}/kk`,
      icon: IoCashOutline,
    },
    {
      header: 'Kokonaiskustannukset',
      info: `${formatCurrency(info.totalFees)}/kk`,
      icon: IoCashOutline,
    },
    {
      header: '',
      info: (
        <a href={info.link} target="_blank" rel="noreferrer">
          Linkki
        </a>
      ),
      icon: IoLinkOutline,
    },
    {
      header: 'Putkiremontti',
      info: info.bathroomRenovation
        ? `${info.bathroomRenovation.timeTo}v päästä, \n
        ${formatCurrency(info.bathroomRenovation.cost)},
        ${formatCurrency(info.bathroomRenovation.monthlyCost || 0)}/kk`
        : 'tehty',
      icon: IoHammerOutline,
    },
    {
      header: 'Rakennusvuosi',
      info: info.buildYear || '?',
      icon: IoHourglassOutline,
    },
    {
      header: 'Asumistuki',
      info: `${formatCurrency(info.housingBenefit)}/kk`,
      icon: IoCashOutline,
    },
    {
      header: 'Yhteensä',
      info: `${formatCurrency(info.totalFees - info.housingBenefit)}/kk`,
      icon: IoCashOutline,
    },
  ]
}
