import { createTRPCRouter, protectedProcedure } from "@/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getVatCommonServiceOutputSchema = z.array(
  z.object({
    ProvinceCode: z.number(),
    ProvinceName: z.string(),
    Amphurs: z.array(
      z.object({
        AmphurCode: z.number(),
        AmphurName: z.string(),
      })
    ),
  })
);
const getVatServiceInputSchema = z.object({
  tin: z.string().default(""),
  name: z.string().default(""),
  provinceCode: z.number().default(0),
  branchNumber: z.number().default(0),
  amphurCode: z.number().default(0),
});
const getVatServiceOutputSchema = z.object({
  NID: z.string().default(""),
  TIN: z.string().default(""),
  TitleName: z.string().default(""),
  Name: z.string().default(""),
  Surname: z.string().default(""),
  BranchTitleName: z.string().default(""),
  BranchName: z.string().default(""),
  BranchNumber: z.number().default(0),
  BuildingName: z.string().default(""),
  FloorNumber: z.string().default(""),
  VillageName: z.string().default(""),
  RoomNumber: z.string().default(""),
  HouseNumber: z.string().default(""),
  MooNumber: z.string().default(""),
  SoiName: z.string().default(""),
  StreetName: z.string().default(""),
  Thambol: z.string().default(""),
  Amphur: z.string().default(""),
  Province: z.string().default(""),
  PostCode: z.string().default(""),
  BusinessFirstDate: z.string().default(""),
  Yaek: z.string().default(""),
});
export const rdAPIRouter = createTRPCRouter({
  getVatCommonService: protectedProcedure
    .output(getVatCommonServiceOutputSchema)
    .query(async () => {
      const response = await fetch(
        "https://rdws.rd.go.th/jsonRD/commonserviceRD3.asmx",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/xml; charset=utf-8",
            SOAPAction:
              "https://rdws.rd.go.th/JserviceRD3/commonserviceRD3/Service",
          },
          body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <Service xmlns="https://rdws.rd.go.th/JserviceRD3/commonserviceRD3">
                    <username>anonymous</username>
                    <password>anonymous</password>
                    <typeofservice>VATCommonService</typeofservice>
                  </Service>
                </soap:Body>
              </soap:Envelope>`,
        }
      ).then(async (res) => {
        const raw = await res.text();

        const object = JSON.parse(
          raw
            .split(`<ServiceResult xsi:type="xsd:string">`)[1]
            .split(`</ServiceResult>`)[0]
        ) as {
          AmphurCode: number[];
          ProvinceCode: number[];
          Description: string[];
        };

        return object.AmphurCode.reduce<
          z.infer<typeof getVatCommonServiceOutputSchema>
        >((acc, cur, i) => {
          const provinceCode = object.ProvinceCode[i];
          const description = object.Description[i];

          const index = acc.findIndex(
            (province) => province.ProvinceCode === provinceCode
          );

          if (!acc[index]) {
            acc.push({
              ProvinceCode: provinceCode,
              ProvinceName: description,
              Amphurs: [],
            });
          } else {
            acc[index].Amphurs.push({
              AmphurCode: cur,
              AmphurName: description,
            });
          }

          return acc;
        }, []);
      });

      return response;
    }),
  getVatService: protectedProcedure
    .input(getVatServiceInputSchema)
    .output(getVatServiceOutputSchema)
    .mutation(async ({ input }) => {
      return await fetch("https://rdws.rd.go.th/jsonRD/vatserviceRD3.asmx", {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "https://rdws.rd.go.th/JserviceRD3/vatserviceRD3/Service",
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <Service xmlns="https://rdws.rd.go.th/JserviceRD3/vatserviceRD3">
                    <username>anonymous</username>
                    <password>anonymous</password>
                    <TIN>${input.tin}</TIN>
                    <Name>${input.name}</Name>
                    <ProvinceCode>${input.provinceCode}</ProvinceCode>
                    <BranchNumber>${input.branchNumber}</BranchNumber>
                    <AmphurCode>${input.amphurCode}</AmphurCode>
                  </Service>
                </soap:Body>
              </soap:Envelope>`,
      }).then(async (res) => {
        const raw = await res.text();
        const object = JSON.parse(
          raw
            .split(`<ServiceResult xsi:type="xsd:string">`)[1]
            .split(`</ServiceResult>`)[0]
        ) as {
          NID: string[];
          TIN: string[];
          TitleName: string[];
          Name: string[];
          Surname: string[];
          BranchTitleName: string[];
          BranchName: string[];
          BranchNumber: number[];
          BuildingName: string[];
          FloorNumber: string[];
          VillageName: string[];
          RoomNumber: string[];
          HouseNumber: string[];
          MooNumber: string[];
          SoiName: string[];
          StreetName: string[];
          Thambol: string[];
          Amphur: string[];
          Province: string[];
          PostCode: string[];
          BusinessFirstDate: string[];
          Yaek: string[];
          msgerr: string[];
        };

        if (!object) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        if (object.msgerr[0]) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: object.msgerr[0],
          });
        }

        return {
          NID: object.NID[0] === "-" ? "" : object.NID[0],
          TIN: object.TIN[0] === "-" ? "" : object.TIN[0],
          TitleName: object.TitleName[0] === "-" ? "" : object.TitleName[0],
          Name: object.Name[0] === "-" ? "" : object.Name[0],
          Surname: object.Surname[0] === "-" ? "" : object.Surname[0],
          BranchTitleName:
            object.BranchTitleName[0] === "-" ? "" : object.BranchTitleName[0],
          BranchName: object.BranchName[0] === "-" ? "" : object.BranchName[0],
          BranchNumber: object.BranchNumber[0],
          BuildingName:
            object.BuildingName[0] === "-" ? "" : object.BuildingName[0],
          FloorNumber:
            object.FloorNumber[0] === "-" ? "" : object.FloorNumber[0],
          VillageName:
            object.VillageName[0] === "-" ? "" : object.VillageName[0],
          RoomNumber: object.RoomNumber[0] === "-" ? "" : object.RoomNumber[0],
          HouseNumber:
            object.HouseNumber[0] === "-" ? "" : object.HouseNumber[0],
          MooNumber: object.MooNumber[0] === "-" ? "" : object.MooNumber[0],
          SoiName: object.SoiName[0] === "-" ? "" : object.SoiName[0],
          StreetName: object.StreetName[0] === "-" ? "" : object.StreetName[0],
          Thambol: object.Thambol[0] === "-" ? "" : object.Thambol[0],
          Amphur: object.Amphur[0] === "-" ? "" : object.Amphur[0],
          Province: object.Province[0] === "-" ? "" : object.Province[0],
          PostCode: object.PostCode[0] === "-" ? "" : object.PostCode[0],
          BusinessFirstDate:
            object.BusinessFirstDate[0] === "-"
              ? ""
              : object.BusinessFirstDate[0],
          Yaek: object.Yaek[0] === "-" ? "" : object.Yaek[0],
        } satisfies z.infer<typeof getVatServiceOutputSchema>;
      });
    }),
});
