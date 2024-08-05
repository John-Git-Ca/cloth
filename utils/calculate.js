export const COUNTRIES = [
  'Hong Kong SAR China',
  'Macao SAR China',
  'United Kingdom',
  'United States',
  'France',
  'Canada',
  'New Zealand',
  'Australia',
  'Japan',
  'South Korea',
  'Singapore',
];

export const calculateShppingCost = (country, quantity) => {
  switch (country) {
    case COUNTRIES[0]: // hong kong
      return 0;
    case COUNTRIES[1]: // macao
      return 0;
    case COUNTRIES[2]: // uk
      return 250 + 150 * (quantity - 1);
    case COUNTRIES[3]: //us
      return 250 + 150 * (quantity - 1);
    case COUNTRIES[4]: //france
      return 250 + 150 * (quantity - 1);
    case COUNTRIES[5]: //canada
      return 275 + 170 * (quantity - 1);
    case COUNTRIES[6]: //new zealan
      return 280 + 180 * (quantity - 1);
    case COUNTRIES[7]: //australia
      return 280 + 180 * (quantity - 1);
    case COUNTRIES[8]: //japan
      return 180 + 70 * (quantity - 1);
    case COUNTRIES[9]: // south korea
      return 195 + 65 * (quantity - 1);
    case COUNTRIES[10]: // ssingapore
      return 195 + 65 * (quantity - 1);
    default:
      return 0;
  }
};
