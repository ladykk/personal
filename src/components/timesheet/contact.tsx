"use client";
import { RouterOutputs } from "@/trpc/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, getNamePrefix } from "@/lib/utils";
import { EmailLink, FaxLink, PhoneLink } from "../common/links";
import { LabelContainer } from "../themes/timesheet";
import { Badge } from "../ui/badge";
import { ComboBox, ComboBoxProps } from "../ui/combo-box";
import { trpc } from "@/trpc/client";
import Contact from "@/server/models/timesheet/contact";

interface BaseContactProps {
  contact: RouterOutputs["timesheet"]["contact"]["getContact"] | null;
}

export function ContactPersonInfo(props: BaseContactProps) {
  if (!props.contact) return;
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="font-medium">{props.contact.contactPerson}</p>
      {props.contact.contactEmail &&
        props.contact.contactEmail
          .split(",")
          .map((email) => <EmailLink key={email} email={email} />)}
      {props.contact.contactPhoneNo &&
        props.contact.contactPhoneNo
          .split(",")
          .map((phoneNo) => <PhoneLink key={phoneNo} phoneNo={phoneNo} />)}
    </div>
  );
}

export function ContactInfo(props: BaseContactProps) {
  if (!props.contact) return;
  return (
    <div className="flex flex-col items-start gap-1">
      {props.contact.email &&
        props.contact.email
          .split(",")
          .map((email) => <EmailLink key={email} email={email} />)}

      {props.contact.telNo &&
        props.contact.telNo
          .split(",")
          .map((telNo) => <PhoneLink key={telNo} phoneNo={telNo} />)}
      {props.contact.phoneNo &&
        props.contact.phoneNo
          .split(",")
          .map((phoneNo) => <PhoneLink key={phoneNo} phoneNo={phoneNo} />)}
      {props.contact.faxNo &&
        props.contact.faxNo
          .split(",")
          .map((faxNo) => <FaxLink key={faxNo} faxNo={faxNo} />)}
    </div>
  );
}

interface ContactDialogProps extends BaseContactProps {
  className?: string;
}

export function ContactDialog(props: ContactDialogProps) {
  if (!props.contact) return;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-fit px-2.5 py-1.5 gap-2", props.className)}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={props.contact.avatarUrl}
              alt={props.contact.companyName}
            />
            <AvatarFallback>
              {getNamePrefix(props.contact.companyName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-medium">{props.contact.companyName}</p>
            <p className="text-xs text-muted-foreground">
              {props.contact.contactPerson}
            </p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {props.contact.companyName}{" "}
            <Badge variant={props.contact.isActive ? "default" : "destructive"}>
              {props.contact.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <LabelContainer
            label="Infomation"
            className="flex gap-5 items-center"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={props.contact.avatarUrl}
                alt={props.contact.companyName}
              />
              <AvatarFallback>
                {getNamePrefix(props.contact.companyName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 h-fit">
              <p className="text-sm font-medium">
                Tax Id: {props.contact.taxId}
              </p>
              <p className="text-sm font-medium">
                {props.contact.isHeadQuarters
                  ? "Head Quarters"
                  : `Branch: ${props.contact.branchCode}`}
              </p>
            </div>
          </LabelContainer>
          <LabelContainer label="Contact Person">
            <ContactPersonInfo contact={props.contact} />
          </LabelContainer>
          <LabelContainer label="Contacts">
            <ContactInfo contact={props.contact} />
          </LabelContainer>
          <LabelContainer label="Address">
            <p className="text-sm">{props.contact.address}</p>
          </LabelContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ContactComboBox<V extends string | number>(
  props: Omit<
    ComboBoxProps<RouterOutputs["timesheet"]["contact"]["getContacts"][0], V>,
    "options" | "setLabel"
  > & {
    size?: "default" | "small";
  }
) {
  const contacts = trpc.timesheet.contact.getContacts.useQuery(
    {},
    { staleTime: Infinity }
  );

  return (
    <ComboBox
      {...props}
      options={contacts.data}
      setLabel={(contact) => contact.companyName}
      loading={contacts.isFetching}
      placeholder={props.placeholder ?? "Select a contact..."}
      setKeyword={Contact.postFormat.keyword}
      searchPlaceholder="Search by company name/contact person/email/phone..."
      searchNoResultText="No contact found."
      classNames={{
        trigger: props.size === "small" ? "h-10" : "h-13",
        drawerTrigger: props.size === "small" ? "h-10" : "h-13",
      }}
      customItemRender={(contact) => (
        <div
          className={cn(
            "flex items-center justify-start",
            props.size === "small" ? "gap-2" : "gap-3"
          )}
        >
          <Avatar className={props.size === "small" ? "w-6 h-6" : "w-8 h-8"}>
            <AvatarImage src={contact.avatarUrl} />
            <AvatarFallback>
              {getNamePrefix(contact.companyName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="font-medium">{contact.companyName}</div>
            {props.size !== "small" && (
              <span className="block text-xs text-gray-500">
                {contact.contactPerson}
              </span>
            )}
          </div>
        </div>
      )}
    />
  );
}
