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

const main = async () => {
  // ExcelJS
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet Broo");
  worksheet.columns = worksheetHeaders;

  let start = 8001; // Start data
  let targetCount = 1000;
  let urlPart = "http://umkm.depkop.go.id/Detail?KoperasiId=";
  let id = 147101001000000;
  let umkms = [];
  for (let count = 0; count < targetCount; count++) {
    let umkm = await scrap(`${urlPart}${id + start + count}`);
    umkms.push(umkm);

    // Save to worksheet
    worksheet.addRow(umkm);
    console.log(`Processed ${count + 1} of ${targetCount}`);
  }

  // Save to file
  console.log(`Saving to file`);
  try {
    await workbook.xlsx.writeFile(
      `./exports/umkm_${start}_to_${start + targetCount - 1}.xlsx`
    );
  } catch (error) {
    console.log(error);
  }
};

main();
