"use client";
import { MainContainer, PageHeader } from "@/components/themes/timesheet";
import { buttonVariants } from "@/components/ui/button";
import { DataTable, DataTablePagination } from "@/components/ui/data-table";
import { useSearchParamsState } from "@/hooks/search-params";
import { getAppUrl } from "@/lib/url";
import { trpc } from "@/trpc/client";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { Mail, Phone, Plus, Printer, Smartphone } from "lucide-react";
import Link from "next/link";

type TimesheetContactClientProps = {
  ROOT_DOMAIN: string;
  initialInput: RouterInputs["timesheet"]["contact"]["getPaginateContacts"];
  initialData: RouterOutputs["timesheet"]["contact"]["getPaginateContacts"];
};
export function TimesheetContactClient(props: TimesheetContactClientProps) {
  const searchParams = useSearchParamsState(props.initialInput);
  const query = trpc.timesheet.contact.getPaginateContacts.useQuery(
    searchParams.values,
    {
      initialData: props.initialData,
    }
  );

  return (
    <MainContainer>
      <PageHeader
        title="Contacts"
        actions={
          <>
            <Link
              className={buttonVariants({
                size: "icon",
              })}
              href={getAppUrl(props.ROOT_DOMAIN, "timesheet", "/contacts/add")}
            >
              <Plus />
            </Link>
          </>
        }
        loading={query.isFetching}
        className="mb-5"
      />
      <DataTable
        data={query.data.list}
        className="mb-3"
        columns={[
          {
            header: "Tax Id",
            accessorKey: "taxId",
            cell: ({ row }) => row.original.taxId || "-",
          },
          {
            header: "Company Name",
            accessorKey: "companyName",
            cell: ({ row }) => (
              <Link
                href={getAppUrl(
                  props.ROOT_DOMAIN,
                  "timesheet",
                  `/contacts/${row.original.id}`
                )}
                className={buttonVariants({ variant: "link", size: "fit" })}
              >
                {row.original.companyName}
              </Link>
            ),
          },
          {
            header: "Contact Person",
            accessorKey: "contactPerson",
            cell: ({ row }) => (
              <div className="flex flex-col items-start gap-1">
                <p>{row.original.contactPerson}</p>
                {row.original.contactEmail &&
                  row.original.contactEmail.split(",").map((email) => (
                    <Link
                      key={email.trim()}
                      className={buttonVariants({
                        variant: "link",
                        size: "fit",
                      })}
                      href={`mailto:${email.trim()}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {email.trim()}
                    </Link>
                  ))}
                {row.original.contactPhoneNo &&
                  row.original.contactPhoneNo.split(",").map((phoneNo) => (
                    <Link
                      key={phoneNo.trim()}
                      className={buttonVariants({
                        variant: "link",
                        size: "fit",
                      })}
                      href={`tel:${phoneNo.trim()}`}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      {phoneNo.trim()}
                    </Link>
                  ))}
              </div>
            ),
          },
          {
            header: "Contacts",
            id: "contacts",
            cell: ({ row }) => (
              <div className="flex flex-col items-start gap-1">
                {row.original.email &&
                  row.original.email.split(",").map((email) => (
                    <Link
                      key={email.trim()}
                      className={buttonVariants({
                        variant: "link",
                        size: "fit",
                      })}
                      href={`mailto:${email.trim()}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {email.trim()}
                    </Link>
                  ))}

                {row.original.telNo &&
                  row.original.telNo.split(",").map((telNo) => (
                    <Link
                      key={telNo.trim()}
                      className={buttonVariants({
                        variant: "link",
                        size: "fit",
                      })}
                      href={`tel:${telNo.trim()}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {telNo.trim()}
                    </Link>
                  ))}
                {row.original.phoneNo &&
                  row.original.phoneNo.split(",").map((phoneNo) => (
                    <Link
                      key={phoneNo.trim()}
                      className={buttonVariants({
                        variant: "link",
                        size: "fit",
                      })}
                      href={`tel:${phoneNo.trim()}`}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      {phoneNo.trim()}
                    </Link>
                  ))}
                {row.original.faxNo &&
                  row.original.faxNo.split(",").map((faxNo) => (
                    <Link
                      key={faxNo.trim()}
                      className={buttonVariants({
                        variant: "link",
                        size: "fit",
                      })}
                      href={`tel:${faxNo.trim()}`}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {faxNo.trim()}
                    </Link>
                  ))}
              </div>
            ),
          },
          {
            header: "Address",
            accessorKey: "address",
            cell: ({ row }) => (
              <p className=" max-w-xs">{row.original.address}</p>
            ),
          },
          {
            header: "Remark",
            accessorKey: "remark",
          },
        ]}
      />
      <DataTablePagination
        count={query.data.count}
        currentPage={query.data.currentPage}
        itemsPerPage={query.data.itemsPerPage}
        totalPages={query.data.totalPages}
        onChangePage={(page) => searchParams.set("page", page)}
        onChangeItemsPerPage={(itemsPerPage) =>
          searchParams.set("itemsPerPage", itemsPerPage)
        }
      />
    </MainContainer>
  );
}
