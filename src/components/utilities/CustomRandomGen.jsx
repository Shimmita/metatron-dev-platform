export default function CustomRandomGen(min = 2, max = 4) {
  return Math.floor(Math.random() * (max - min+1)) + min;
}
