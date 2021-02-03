import { calculateMonthlyFee } from './loanCalculator'
import { Renovation } from '../../../types'
import apartmentInfos from '../assets/apartmentInfos.json'
import {
  IoHomeOutline,
  IoPricetagOutline,
  IoSquareOutline,
  IoLocationOutline,
  IoLinkOutline,
  IoHammerOutline,
  IoHourglassOutline,
  IoBusOutline,
} from 'react-icons/io5'
import { ParsedApartmentInfo } from '../../../types'
import formatCurrency from './currencyFormatter'
import calculateHousingBenefit from './housingBenefitCalculator'
import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'

export const getApartmentInfos = () => {
  return apartmentInfos.map((info) => {
    const loanFee = info.loanFee || 0
    const maintananceFee = info.maintananceFee || 0
    const otherFees = (info.waterFee || 0) + (info.otherFees || 0)
    let amountToLoan =
      (info.newBuilding
        ? info.loanFreePrice || info.sellingPrice
        : info.sellingPrice || info.loanFreePrice) || 0
    const ownLoanFee = calculateMonthlyFee({ loanAmount: amountToLoan })
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

interface infoBox {
  header: string
  info: string | ReactNode
  Icon?: IconType
}

export const getInfoBoxes = (
  info: ParsedApartmentInfo,
  type?: 'fees' | 'travelTimes'
): infoBox[] => {
  switch (type) {
    case 'fees':
      return [
        {
          header: 'Rahoitusvastike',
          info: `${formatCurrency(info.loanFee)}/kk`,
        },
        {
          header: 'Hoitovastike',
          info: `${formatCurrency(info.maintananceFee)}/kk`,
        },
        {
          header: 'Muut kustannukset',
          info: `${formatCurrency(info.otherFees)}/kk`,
        },
        {
          header: 'Asuntolaina',
          info: `${formatCurrency(info.ownLoanFee)}/kk`,
        },
        {
          header: 'Asumistuki',
          info: `${formatCurrency(info.housingBenefit)}/kk`,
        },
        {
          header: 'Yhteensä',
          info: `${formatCurrency(info.totalFees - info.housingBenefit)}/kk`,
        },
      ]
    case 'travelTimes':
      return info.travelTimes.map(({ destination, duration }) => ({
        header: destination,
        info: `${duration} min`,
        Icon: IoBusOutline,
      }))
    default:
      return [
        {
          header: 'Osoite',
          info: info.address,
          Icon: IoHomeOutline,
        },
        {
          header: 'Asuinalue',
          info: `${info.district}, ${info.city}`,
          Icon: IoLocationOutline,
        },
        {
          header: 'Velaton hinta',
          info: formatCurrency(info.loanFreePrice || info.sellingPrice || 0, -3),
          Icon: IoPricetagOutline,
        },
        {
          header: 'Pinta-ala',
          info: `${info.sqrMeters} m²`,
          Icon: IoSquareOutline,
        },
        {
          header: '',
          info: (
            <a href={info.link} target="_blank" rel="noreferrer">
              Linkki
            </a>
          ),
          Icon: IoLinkOutline,
        },
        {
          header: 'Putkiremontti',
          info: info.bathroomRenovation
            ? `${info.bathroomRenovation.timeTo}v päästä, \n
            ${formatCurrency(info.bathroomRenovation.cost)},
            ${formatCurrency(info.bathroomRenovation.monthlyCost || 0)}/kk`
            : 'tehty',
          Icon: IoHammerOutline,
        },
        {
          header: 'Rakennusvuosi',
          info: info.buildYear || '?',
          Icon: IoHourglassOutline,
        },
      ]
  }
}
