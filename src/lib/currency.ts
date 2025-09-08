/**
 * Utility functions for currency formatting in BsV (Bolívares Venezolanos)
 */

export const formatBsV = (amount: number): string => {
  return `${amount.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} BsV`;
};

export const formatBsVSimple = (amount: number): string => {
  return `${amount.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} BsV`;
};

export const CURRENCY_SYMBOL = "BsV";
export const CURRENCY_CODE = "VES";
