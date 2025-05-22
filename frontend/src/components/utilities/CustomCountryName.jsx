export default function CustomCountryName(country) {
  // handle the country name
  let country_name = "";
  if (country) {
    const split_res = country.split(" (")[0].split(" ");
    if (split_res.length <= 2) {
      country_name = split_res[1];
    } else if (split_res.length <= 5 && split_res.includes("and")) {
      country_name = split_res[1] + "-" + split_res[3];
    } else {
      country_name = split_res[1] + "-" + split_res[2];
    }
    return country_name;
  }
}
