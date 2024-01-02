import * as auth from "./auth";
import * as storage from "./storage";
import * as relation from "./relation";

const schema = {
  ...auth,
  ...storage,
  ...relation,
};

export default schema;
