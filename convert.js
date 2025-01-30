const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");
const moment = require("moment");

async function main() {
  const db = await open({
    filename: "./salat.db",
    driver: sqlite3.Database,
  });
  const islands = await db.all("SELECT * FROM Island");
  islands.forEach(async (island) => {
    const prayerTimes = (
      await db.all(
        "SELECT * FROM PrayerTimes WHERE CategoryId = ?",
        island.CategoryId
      )
    ).map((p) => {
      delete p.CategoryId;
      return p;
    });
    const csv = prayerTimes
      .map((p) => {
        const date = moment().dayOfYear(p.Date).year(2024); // 2024 is a leap year
        const data = [
          // p.Date,
          date.date(),
          date.month() + 1,
        ];
        [
          p.Fajuru + island.Minutes,
          p.Sunrise + island.Minutes,
          p.Dhuhr + island.Minutes,
          p.Asr + island.Minutes,
          p.Maghrib + island.Minutes,
          p.Isha + island.Minutes,
        ].forEach((time) => {
          const hours = Math.floor(time / 60);
          const minutes = time % 60;
          data.push(`${hours}:${minutes < 10 ? "0" : ""}${minutes}`);
        });
        return data.join(",");
      })
      .join("\n");
    fs.writeFileSync(`./csv/${island.IslandId}.csv`, csv);
    // if (island.IslandId === 102) console.log(csv);
  });
}

main();
