// utils/validerVehicule.js
function validerVehicule(v) {
  const currentYear = new Date().getFullYear();

  return (
    v &&
    typeof v.registrationNumber === 'string' &&
    v.registrationNumber.trim() !== '' &&
    typeof v.make === 'string' &&
    v.make.trim() !== '' &&
    typeof v.model === 'string' &&
    v.model.trim() !== '' &&
    typeof v.year === 'number' &&
    Number.isInteger(v.year) &&
    v.year > 1900 &&
    v.year <= currentYear &&
    typeof v.rentalPrice === 'number' &&
    v.rentalPrice > 0
  );
}

export { validerVehicule };

