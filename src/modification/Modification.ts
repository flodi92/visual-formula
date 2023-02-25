import { ID } from "../types";

export default interface Modification {
    id?: ID;
    ids?: [ID, ID]
    type?: string;
}

