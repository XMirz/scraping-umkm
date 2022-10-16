import axios from "axios";
import { JSDOM } from "jsdom";
import ExcelJS from "exceljs";

const worksheetHeaders = [
  { header: "Nama Usaha" },
  { header: "Nomor Surat Izin" },
  { header: "Tanggal Mulai Usaha" },
  { header: "NPWP" },
  { header: "Status Usaha" },
  { header: "Alamat" },
  { header: "Kelurahan/Desa" },
  { header: "Kecamatan" },
  { header: "Kabupaten/Kota" },
  { header: "Provinsi" },
  { header: "Kode Pos" },
  { header: "Nomor Telpon" },
  { header: "No Telpon Kantor" },
  { header: "Faximili" },
  { header: "Email" },
  { header: "Website" },
  { header: "Bentuk Usaha" },
  { header: "Sektor Usaha" },
  { header: "Skala Usaha" },
  { header: "Tenaga Kerja Pria" },
  { header: "Tenaga Kerja Wanita" },
  { header: "Jumlah Tenaga Kerja" },
  { header: "Karyawan Pria" },
  { header: "Karyawan Wanita" },
  { header: "Jumlah Karyawan" },
  { header: "ID UMKM" },
  { header: "Grade" },
];

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
    return null;
  }
};

const save = async (workbook, path) => {
  // Save to file
  // console.log(`Saving to file`);
  try {
    await workbook.xlsx.writeFile(path);
  } catch (error) {
    console.log(error);
  }
};

const main = async (first, last) => {
  // ExcelJS
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet Broo");
  worksheet.columns = worksheetHeaders;

  // let startingPoint = 147101002003639; 8001
  let startingPoint = 147101004001693;
  let current = startingPoint;
  let endingPoint = 147101004001872;
  // let endingPoint = 147101003001380;
  let urlPart = "http://umkm.depkop.go.id/Detail?KoperasiId=";
  // let umkms = [];

  let visitedCount = 0;
  let okCount = 0;
  while (current <= endingPoint) {
    let url = `${urlPart}${current}`;
    let umkm = await scrap(`${url}`);

    // Save to worksheet
    if (umkm.length > 0) {
      worksheet.addRow(umkm);
      save(workbook, `./exports/umkm_${first}_to_${last}.xlsx`);
      okCount++;
    } else if (umkm.length == 0) {
      current = current - current.toString().substring(9, 15) + 1001001;
      console.log("Incrementing about million");
    }
    visitedCount++;
    console.log(
      `Visited : ${visitedCount}\t Succeed : ${okCount}\t CurrentId : ${current}`
    );
    current++;
  }
};

main(15001, 16000);
