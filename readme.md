# MV Prayertimes DB

A repository containing all the prayertimes taken from Salat MV

The code used to generate all the CSV files is in convert.js

## Basic Usage

The headers for all the CSV files are as such, these headers are not included in the CSV files and are only for your reference.

```csv
Day of Year, Fajr, Sunrise, Dhuhr, Asr, Sunset, Isha
```

Note that the **Day of Year starts at zero**

All of the timestamps given are the number of minutes past midnight of that day of the year. So, to calculate the hour:minute syntax you can use math similar to the example given below.

```js
let hour = Math.floor(t / 60) // quotient
let minute = t % 60 // remainder
```

To get the csv file for your appropriate island, please refer to the [Island Mapping](https://github.com/WovenCoast/prayertimes-db/blob/main/island-mapping.md)

### Leap Years

> tl;dr - if ( is not leap year ) { skip row where day of year is 59 }

Each file has 366 rows to account for leap years. This means however, that your code will work on non leap years even if you forget to start counting your day of the year from 0.

```js
// https://stackoverflow.com/a/40975730
function daysIntoYear(date){
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

// https://stackoverflow.com/a/8175905
function isLeapYear(date) {
  const year = date.getFullYear();
  return new Date(year, 1, 29).getMonth() == 1;
}

// ❌ BAD
let dayOfYear = daysIntoYear(new Date());

// ✅ GOOD
let dayOfYear = daysInfoYear(new Date()) - 1; // day of year in the csv file starts with 0 not 1
if (!isLeapYear(new Date()) && dayOfYear >= 59) dayOfYear++; // if is not leap year and day is after february 29, add one to dayOfYear
```

In the CSV files, the 60th line (where day of year is 59) is February 29. **SKIP THAT LINE IF IT ISN'T A LEAP YEAR**. If this is not accounted for, the results will be accurate up until March 2 where in Male' (island id 102) Asr prayer will be erroneously read as 936 (5:04) instead of 935 (5:03), which is why this issue was not investigated further until a leap year hit.

## Defining Tests

When implementing unit tests or checking if your logic works, it's best to check if the prayertimes in the given dates below match up correctly with Male' (island ID 102).
- [0] January 1: Ensure that "Sunrise" is 371 (6:11) and is not 370 (6:10), "Dhuhr" is 744 (12:13) and is not 745 (12:14), "Isha" is 1165 (19:25) and is not 1166 (19:26)
- [61] March 2: Ensure that "Sunrise" is 376 (6:16) and is not 375 (6:15), "Dhuhr" is 742 (12:22) and is not 743 (12:23), "Asr" is 935 (15:35) and is not 936 (15:36)

> A few random samples checking with the calendar is also recommended.
