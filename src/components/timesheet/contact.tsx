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
import { getNamePrefix } from "@/lib/utils";
import { EmailLink, FaxLink, PhoneLink } from "../common/links";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { LabelContainer } from "../themes/timesheet";
import { Badge } from "../ui/badge";

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

export function ContactDialog(props: BaseContactProps) {
  if (!props.contact) return;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className=" h-fit px-2.5 py-1.5 gap-2">
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
