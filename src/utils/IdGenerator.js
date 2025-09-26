class IdGenerator {
    constructor(db, collectionName){
        this.db = db;
        this.collectionName = collectionName;
    }

   generateId(prefix = "") {
        const items = this.db.getCollection(this.collectionName);
        if (!items || items.length === 0) {
            return prefix + "1";
        }
        const lastItem = items[items.length - 1];
        return prefix + (parseInt(lastItem.id) + 1).toString();
    }
}

export default IdGenerator;