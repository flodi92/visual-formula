import { ID, ModificationType } from "../types";

export default interface Modification {
    id?: ID;
    ids?: [ID, ID]
    type?: ModificationType;
}

