const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");

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
        return [
          p.Date,
          p.Fajuru + island.Minutes,
          p.Sunrise + island.Minutes,
          p.Dhuhr + island.Minutes,
          p.Asr + island.Minutes,
          p.Maghrib + island.Minutes,
          p.Isha + island.Minutes,
        ].join(",");
      })
      .join("\n");
    fs.writeFileSync(`./out/${island.IslandId}.csv`, csv);
    // if (island.IslandId === 102) console.log(csv);
  });
}

main();
