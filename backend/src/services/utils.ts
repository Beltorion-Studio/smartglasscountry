interface ItemObject {
  [key: string]: string;
}

function getUnitPrice(itemObject: ItemObject, itemName: string): number {
  // Create a new object with all keys in lowercase
  const lowercaseItemObject: ItemObject = Object.keys(itemObject).reduce((acc, key) => {
    acc[key.toLowerCase()] = itemObject[key];
    return acc;
  }, {} as ItemObject);

  // Construct the price key using the lowercase item name and 'price' also in lowercase
  const priceKey: string = `${itemName.toLowerCase()}price`;

  // Access the price in the object using the lowercase price key
  const priceString: string = lowercaseItemObject[priceKey];

  if (!priceString) {
    return 0;
  }
  return parseFloat(priceString);
}
function getInsurancePercentage(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject: ItemObject = Object.keys(itemObject).reduce((acc, key) => {
    acc[key.toLowerCase()] = itemObject[key];
    return acc;
  }, {} as ItemObject);

  const insuranceKey: string = `${itemName.toLowerCase()}insurance`;

  const insuranceString: string = lowercaseItemObject[insuranceKey];

  if (!insuranceString) {
    return 0;
  }
  return parseFloat(insuranceString);
}
function getShippingCost(itemObject: ItemObject, itemName: string): number {
  const lowercaseItemObject: ItemObject = Object.keys(itemObject).reduce((acc, key) => {
    acc[key.toLowerCase()] = itemObject[key];
    return acc;
  }, {} as ItemObject);

  const shippingKey: string = `${itemName.toLowerCase()}shipping`;

  const shippingString: string = lowercaseItemObject[shippingKey];
  console.log({ shippingKey, shippingString });

  if (!shippingString) {
    return 0;
  }
  return parseFloat(shippingString);
}

export { getInsurancePercentage, getShippingCost, getUnitPrice };
