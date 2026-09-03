export const formatMetric = (value) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "0";
  }

  if (numberValue >= 1000000) {
    const millions = numberValue / 1000000;
    return `${millions >= 10 ? Math.round(millions) : millions.toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (numberValue >= 1000) {
    const thousands = numberValue / 1000;
    return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, "")}K`;
  }

  return new Intl.NumberFormat("en-US").format(numberValue);
};
