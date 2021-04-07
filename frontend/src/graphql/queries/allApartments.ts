const allApartments = `
  query {
    allApartments {
      link
      address
      district
      sqrMeters
      loanFreePrice
      sellingPrice
      pricePerSqrMeter
      rooms
      roomAmount
      condition
      houseType
      livingType
      plotType
      newBuilding
      buildYear
      loanFee
      maintananceFee
      waterFee
      otherFees
      imageLink
      smallDistrict
      bigDistrict
      travelTimes {
        duration
        destination
      }
      bigRenovations {
        type
        cost
        monthlyCost
        timeTo
      }
      coordinates {
        lat
        lon
      }
    }
  }
  `

export default allApartments
