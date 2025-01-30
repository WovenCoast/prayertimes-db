# MV Prayertimes DB

A repository containing all the prayertimes taken from Salat MV

The code used to generate all the CSV files is in convert.js

> The `out` folder is kept for backwards compatibility, and the `csv` folder is the new folder where all the CSV files are stored.

## Basic Usage

The headers for all the CSV files are as such, these headers are not included in the CSV files and are only for your reference.

```csv
Day, Month, Fajr, Sunrise, Dhuhr, Asr, Sunset, Isha
```

Month starts at 1 for January, and Day starts at 1 for the first day of the month.

All of the timestamps given in the format hh:mm and are in the 24-hour format.

To get the csv file for your appropriate island, please refer to the [Island Mapping](https://github.com/WovenCoast/prayertimes-db/blob/main/island-mapping.md)

## Defining Tests

When implementing unit tests or checking if your logic works, it's best to check if the prayertimes in the given dates below match up correctly with Male' (island ID 102).
- [0] January 1: Ensure that "Sunrise" is 6:11 and is not 6:10, "Dhuhr" is 12:13 and is not 12:14, "Isha" is 19:25 and is not 19:26
- [61] March 2: Ensure that "Sunrise" is 6:16 and is not 6:15, "Dhuhr" is 12:22 and is not 12:23, "Asr" is 15:35 and is not 15:36

> Why these two specifically? Most errors occur from not handling the first day of the month correctly, and the leap year. These two dates are the first day of the month and a leap year day respectively.

> A few random samples checking with the calendar is also recommended.
