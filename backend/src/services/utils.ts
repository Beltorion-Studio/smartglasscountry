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

  if (priceString) {
    // Convert the price to a number and return it
    return parseFloat(priceString);
  }
}

export { getUnitPrice };
