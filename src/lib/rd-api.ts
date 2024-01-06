import { RouterOutputs } from "@/trpc/shared";

export function VATResultToContact(
  vatResult: RouterOutputs["rdAPI"]["getVatService"]
) {
  let tid: string = "";
  let name: string = "";
  let companyName: string = "";
  let isHeadQuarter: boolean = false;
  let address: string = "";
  if (vatResult.NID) tid = vatResult.NID;
  if (vatResult.TIN) tid = vatResult.TIN;
  if (vatResult.TitleName) name = vatResult.TitleName;
  if (vatResult.Name) name = name + " " + vatResult.Name;
  if (vatResult.Surname) name = name + " " + vatResult.Surname;
  if (vatResult.BranchTitleName) companyName = vatResult.BranchTitleName;
  if (vatResult.BranchName)
    companyName = companyName + " " + vatResult.BranchName;
  isHeadQuarter = vatResult.BranchNumber === 0;
  if (vatResult.RoomNumber) address = `ห้อง ${vatResult.RoomNumber}`;
  if (vatResult.FloorNumber)
    address = address + ` ชั้น ${vatResult.FloorNumber}`;
  if (vatResult.BuildingName)
    address = address + ` อาคาร ${vatResult.BuildingName}\n`;
  if (vatResult.HouseNumber) address = address + `${vatResult.HouseNumber}`;
  if (vatResult.VillageName)
    address = address + ` หมู่บ้าน ${vatResult.VillageName}`;
  if (vatResult.MooNumber) address = address + ` หมู่ ${vatResult.MooNumber}`;
  if (vatResult.SoiName) address = address + ` ซอย ${vatResult.SoiName}`;
  if (vatResult.StreetName) address = address + ` ถนน ${vatResult.StreetName}`;
  if (vatResult.Thambol) address = address + ` ตำบล ${vatResult.Thambol}`;
  if (vatResult.Amphur) address = address + ` อำเภอ ${vatResult.Amphur}`;
  if (vatResult.Province) address = address + ` จังหวัด ${vatResult.Province}`;
  if (vatResult.PostCode) address = address + ` ${vatResult.PostCode}`;
  return {
    tid,
    name: name.trim(),
    companyName: companyName.trim(),
    isHeadQuarter,
    address: address.trim(),
  };
}
