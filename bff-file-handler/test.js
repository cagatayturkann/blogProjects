const pins = [];
const createAPin = () => {
  try {
    let fourDigitPin = Math.round(1000 + Math.random() * 9000).toString();
    if (fourDigitPin.length === 3) {
      fourDigitPin = '0' + fourDigitPin;
    }
    pins.push(fourDigitPin);
    return fourDigitPin;
  } catch (error) {
    console.log(error);
  }
};

for (let i = 0; i <= 1000; i++) {
  const digit = createAPin();
  console.log(digit);
  if (pins.length === 1001) {
    console.log('you can not produce more digits');
  }
}
