import { ObjectId } from "mongodb";

class IdGenerator {
    constructor(collection) {
        this.collection = collection; // colección de Mongo
    }

    async generateId(prefix = "") {

        const newId = new ObjectId();
        const shortId = newId.toHexString().slice(-5); // últimos 5 caracteres

        return prefix ? `${prefix}${shortId}` : shortId;
    }
}

export default IdGenerator;
