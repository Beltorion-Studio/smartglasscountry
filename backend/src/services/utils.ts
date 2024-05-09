interface ItemObject {
  [key: string]: string;
}

function getLowercaseItemObject(itemObject: ItemObject): ItemObject {
  return Object.keys(itemObject).reduce((acc, key) => {
    acc[key.toLowerCase()] = itemObject[key];
    return acc;
  }, {} as ItemObject);
}

function getUnitPrice(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject = getLowercaseItemObject(itemObject);
  const priceKey: string = `${itemName.toLowerCase()}price`;
  const priceString: string = lowercaseItemObject[priceKey];
  return priceString ? parseFloat(priceString) : 0;
}

function getInsurancePercentage(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject = getLowercaseItemObject(itemObject);
  const insuranceKey: string = `${itemName.toLowerCase()}insurance`;
  const insuranceString: string = lowercaseItemObject[insuranceKey];
  return insuranceString ? parseFloat(insuranceString) : 0;
}

function getShippingCost(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject = getLowercaseItemObject(itemObject);
  const shippingKey: string = `${itemName.toLowerCase()}shipping`;
  const shippingString: string = lowercaseItemObject[shippingKey];
  return shippingString ? parseFloat(shippingString) : 0;
}

function getDiscountPeriod(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject = getLowercaseItemObject(itemObject);
  const discountPeriodKey: string = `${itemName.toLowerCase()}discountperiod`;
  const discountPeriodString: string = lowercaseItemObject[discountPeriodKey];
  return discountPeriodString ? parseFloat(discountPeriodString) : 0;
}

function getMinOrderQuantity(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject = getLowercaseItemObject(itemObject);
  const minOrderQuantityKey: string = `${itemName.toLowerCase()}minorder`;
  const minOrderQuantityString: string = lowercaseItemObject[minOrderQuantityKey];
  return minOrderQuantityString ? parseFloat(minOrderQuantityString) : 0;
}

export {
  getDiscountPeriod,
  getInsurancePercentage,
  getMinOrderQuantity,
  getShippingCost,
  getUnitPrice,
};
