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
    return [];
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

  let startingPoint = 147101002003639;
  let current = startingPoint;
  let endingPoint = 147101003001200;
  let urlPart = "http://umkm.depkop.go.id/Detail?KoperasiId=";
  // let umkms = [];

  let visitedCount = 0;
  let okCount = 0;
  while (current <= endingPoint) {
    let url = `${urlPart}${current}`;
    let umkm = await scrap(`${url}`);

    if (umkm != null) {
      worksheet.addRow(umkm);
      save(workbook, `./exports/umkm_${first}_to_${last}.xlsx`);
      okCount++;
    }

    // Save to worksheet
    current++;
    visitedCount++;
    console.log(`Visited : ${visitedCount}\t Succeed : ${okCount}`);
  }
};

main(8001, 9000);
