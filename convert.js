const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");

const toCSV = (prayerTimes, island) => {
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
};
const toJSON = (prayerTimes, island) => {
  const json = prayerTimes.reduce((pv, cv) => {
    pv[cv.Date] = {
      Date: cv.Date,
      Fajaru: cv.Fajuru + island.Minutes,
      Sunrise: cv.Sunrise + island.Minutes,
      Dhuhr: cv.Dhuhr + island.Minutes,
      Asr: cv.Asr + island.Minutes,
      Maghrib: cv.Maghrib + island.Minutes,
      Isha: cv.Isha + island.Minutes,
    };
    return pv;
  }, {});

  fs.writeFileSync(`./json/${island.IslandId}.json`, JSON.stringify(json));
};

async function main(asJSON) {
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

    if (asJSON) toJSON(prayerTimes, island);
    else toCSV(prayerTimes, island);

    // if (island.IslandId === 102) console.log(csv);
  });
}

const asJSON = process.argv[2] === "--json";

main(asJSON);
