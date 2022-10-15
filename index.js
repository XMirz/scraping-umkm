import axios from "axios";
import { JSDOM } from "jsdom";

const scrap = async (url) => {
  const umkm = [];
  try {
    const { data } = await axios.get(url);
    let dom = new JSDOM(data).window.document;
    let tableRows = dom.querySelectorAll("table tbody tr");
    // console.log(tableRows);
    tableRows.forEach((row, index) => {
      if ([0, 20, 27, 30].includes(index)) {
        return;
      }
      let value = row.querySelector("td:nth-child(2)").textContent;
      umkm.push(value);
    });
    return umkm;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const main = async () => {
  let target = 2;
  let urlPart = "http://umkm.depkop.go.id/Detail?KoperasiId=";
  let startId = 147101001000001;
  let umkms = [];
  for (let count = 1; count <= target; count++) {
    let umkm = await scrap(`${urlPart}${startId + count}`);
    umkms.push(umkm);
  }
  console.log(umkms);
  console.log(umkms.length);
};

main();
