import * as auth from "./auth";
import * as storage from "./storage";
import * as relation from "./relation";
import * as timesheet from "./timesheet";

const schema = {
  ...auth,
  ...storage,
  ...relation,
  ...timesheet,
};

export default schema;
