"use client";
import {
  BooleanDropdown,
  FilterItem,
  SearchKeywordInput,
} from "@/components/common/filters";
import {
  FiltersContainer,
  MainContainer,
  PageHeader,
} from "@/components/themes/timesheet";
import { ContactComboBox, ContactDialog } from "@/components/timesheet/contact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DataTable, DataTablePagination } from "@/components/ui/data-table";
import { useSearchParamsState } from "@/hooks/search-params";
import { getAppUrl } from "@/lib/url";
import { getNamePrefix } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { RouterInputs, RouterOutputs } from "@/trpc/shared";
import { Plus } from "lucide-react";
import Link from "next/link";

type TimesheetProjectClientProps = {
  ROOT_DOMAIN: string;
  initialInput: RouterInputs["timesheet"]["project"]["getPaginateProjects"];
  initialData: RouterOutputs["timesheet"]["project"]["getPaginateProjects"];
};

export function TimesheetProjectClient(props: TimesheetProjectClientProps) {
  const searchParams = useSearchParamsState(props.initialInput);
  const query = trpc.timesheet.project.getPaginateProjects.useQuery(
    searchParams.values,
    {
      initialData: props.initialData,
    }
  );
  return (
    <MainContainer>
      <PageHeader
        title="Projects"
        actions={
          <Link
            href={getAppUrl(props.ROOT_DOMAIN, "timesheet", "/projects/add")}
            className={buttonVariants({
              size: "icon",
            })}
          >
            <Plus />
          </Link>
        }
        loading={query.isFetching}
        className="mb-5"
      />
      <FiltersContainer
        left={
          <>
            <SearchKeywordInput
              defaultValue={searchParams.values.searchKeyword}
              placeholder="Search by Project name, Company name..."
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
            <FilterItem title="Contact">
              <ContactComboBox
                value={searchParams.values.contactId}
                onChange={(value) =>
                  value
                    ? searchParams.set("contactId", value)
                    : searchParams.clear("contactId")
                }
                setValue={(contact) => contact.id.toString()}
                clearable
                size="small"
              />
            </FilterItem>

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
            header: "Icon",
            accessorKey: "iconUrl",
            cell: ({ row }) => (
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={row.original.iconUrl}
                  alt={row.original.name}
                />
                <AvatarFallback>
                  {getNamePrefix(row.original.name)}
                </AvatarFallback>
              </Avatar>
            ),
          },
          {
            header: "Project Name",
            accessorKey: "name",
            cell: ({ row }) => (
              <Link
                href={getAppUrl(
                  props.ROOT_DOMAIN,
                  "timesheet",
                  `/projects/${row.original.id}`
                )}
                className={buttonVariants({ variant: "link", size: "fit" })}
              >
                {row.original.name}
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
            header: "Contact",
            accessorKey: "contact",
            cell: ({ row }) => <ContactDialog contact={row.original.contact} />,
          },
          {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => (
              <p className="max-w-xs">{row.original.description}</p>
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
