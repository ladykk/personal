"use client";
import {
  BooleanDropdown,
  SearchKeywordInput,
} from "@/components/common/filters";
import {
  FiltersContainer,
  MainContainer,
  PageHeader,
} from "@/components/themes/timesheet";
import { ContactInfo, ContactPersonInfo } from "@/components/timesheet/contact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DataTable, DataTablePagination } from "@/components/ui/data-table";
import { useSearchParamsState } from "@/hooks/search-params";
import { getAppUrl } from "@/lib/url";
import { getNamePrefix } from "@/lib/utils";
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
      <FiltersContainer
        left={
          <>
            <SearchKeywordInput
              defaultValue={searchParams.values.searchKeyword}
              placeholder="Search by Tax ID, Company name, Email, Tel no, Phone no, Fax no, Contact person, Contact email, Contact phone no..."
              className=" max-w-xs"
              onChange={(value) =>
                value.length > 1
                  ? searchParams.set("searchKeyword", value)
                  : searchParams.clear("searchKeyword")
              }
            />
          </>
        }
        right={
          <>
            <BooleanDropdown
              title="Is Head Quarters"
              defaultValue={searchParams.values.isHeadQuarters}
              label={{
                default: "Yes / No",
                true: "Yes",
                false: "No",
              }}
              onChange={(value) =>
                value
                  ? searchParams.set("isHeadQuarters", value)
                  : searchParams.clear("isHeadQuarters")
              }
            />
            <BooleanDropdown
              title="Is Active"
              defaultValue={searchParams.values.isActive}
              onChange={(value) =>
                value
                  ? searchParams.set("isActive", value)
                  : searchParams.clear("isActive")
              }
            />
          </>
        }
      />
      <DataTable
        data={query.data.list}
        className="mb-3"
        columns={[
          {
            header: "Avatar",
            accessorKey: "avatarUrl",
            cell: ({ row }) => (
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={row.original.avatarUrl}
                  alt={row.original.companyName}
                />
                <AvatarFallback>
                  {getNamePrefix(row.original.companyName)}
                </AvatarFallback>
              </Avatar>
            ),
          },
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
            header: "Is Active",
            accessorKey: "isActive",
            cell: ({ row }) => (
              <Badge
                variant={row.original.isActive ? "default" : "destructive"}
              >
                {row.original.isActive ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            header: "Contact Person",
            accessorKey: "contactPerson",
            cell: ({ row }) => <ContactPersonInfo contact={row.original} />,
          },
          {
            header: "Contacts",
            id: "contacts",
            cell: ({ row }) => <ContactInfo contact={row.original} />,
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
            cell: ({ row }) => (
              <p className="max-w-xs">{row.original.remark}</p>
            ),
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
