import { calculateMonthlyFee } from './loanCalculator'
import { Renovation, ApartmentInfo } from '../sharedTypes/typesFromRuntypes'
import {
  IoHomeOutline,
  IoPricetagOutline,
  IoSquareOutline,
  IoLocationOutline,
  IoLinkOutline,
  IoHammerOutline,
  IoHourglassOutline,
  IoNavigateOutline,
  IoStorefrontOutline,
  IoSchoolOutline,
} from 'react-icons/io5'
import { ParsedApartmentInfo, LoanSettings } from '../sharedTypes/types'
import formatCurrency from './currencyFormatter'
import calculateHousingBenefit from './housingBenefitCalculator'
import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import roundTo from 'round-to'

export const getApartmentInfos = (
  apartmentInfos: ApartmentInfo[],
  loanSettings: LoanSettings | undefined
) => {
  return apartmentInfos.map((info) => {
    const loanFee = info.loanFee || 0
    const maintananceFee = info.maintananceFee || 0
    const otherFees = (info.waterFee || 0) + (info.otherFees || 0)
    let amountToLoan =
      (info.newBuilding
        ? info.loanFreePrice || info.sellingPrice
        : info.sellingPrice || info.loanFreePrice) || 0
    const ownLoanFee = calculateMonthlyFee({
      loanAmount: amountToLoan,
      ...loanSettings,
    })
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
  type?: 'fees' | 'pointsOfIntrest'
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
    case 'pointsOfIntrest':
      return info?.pointsOfIntrest?.map(({ name, directDistance, type }) => {
        let icon = IoNavigateOutline
        if (
          ['suomiYla', 'suomiAla', 'ruotsiYla', 'ruotsiAla', 'lukio', 'university'].includes(type)
        ) {
          icon = IoSchoolOutline
        } else if (type === 'bigStore' || type === 'store') {
          icon = IoStorefrontOutline
        }
        return {
          header: `${type}: ${name}`,
          info: `${roundTo(directDistance / 1000, 1)} km`,
          Icon: icon,
        }
      })
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
          info:
            info.bathroomRenovation && info.bathroomRenovation.timeTo <= 20
              ? `${info.bathroomRenovation.timeTo}v päästä, \n
            ${formatCurrency(info.bathroomRenovation.cost)},
            ${formatCurrency(info.bathroomRenovation.monthlyCost || 0)}/kk`
              : 'yli 20v päästä',
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
