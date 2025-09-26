import db from '../config/db.js';
import IdGenerator from '../utils/IdGenerator.js';

class BaseModel {
    constructor(collectionName, EntityClass, fieldsOrder) {
        this.collectionName = collectionName;
        this.EntityClass = EntityClass;
        this.fieldsOrder = fieldsOrder;
        this.idGen = new IdGenerator(db, collectionName);
    }

    
    async create(data) {
        const collection = db.getCollection(this.collectionName);

        // Si hay fieldsOrder definido, reordenamos data
        const values = this.fieldsOrder
            ? this.fieldsOrder.map(field => data[field])
            : Object.values(data);

        const newItem = new this.EntityClass(...values);

        collection.push(newItem);
        db.setCollection(this.collectionName, collection);
        await db.saveData();
        return newItem;
    }

    async findAll() {
        return db.getCollection(this.collectionName);
    }

    async findById(id) {
        const collection = db.getCollection(this.collectionName);
        return collection.find(item => String(item.id) === String(id));
    }

    // async update(id, updateData) {
    //     const collection = db.getCollection(this.collectionName);
    //     const index = collection.findIndex(item => String(item.id) === String(id));
    //     if (index === -1) return null;

    //     collection[index] = { ...collection[index], ...updateData, id };
    //     db.setCollection(this.collectionName, collection);
    //     await db.saveData();
    //     return collection[index];
    // }

    async update(id, updateData) {
    const collection = db.getCollection(this.collectionName);
    const index = collection.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;

    // Reordenar updateData según fieldsOrder si existe
    let reorderedData;
    if (this.fieldsOrder) {
        reorderedData = {};
        for (const field of this.fieldsOrder) {
            if (field in updateData) {
                reorderedData[field] = updateData[field];
            }
        }
        // agregar los campos que no están en fieldsOrder al final
        for (const key of Object.keys(updateData)) {
            if (!this.fieldsOrder.includes(key)) {
                reorderedData[key] = updateData[key];
            }
        }
    } else {
        reorderedData = updateData;
    }

    // Merge manteniendo el orden
    collection[index] = { ...collection[index], ...reorderedData, id };
    db.setCollection(this.collectionName, collection);
    await db.saveData();
    return collection[index];
}


    async patch(id, updateData) {
        const collection = db.getCollection(this.collectionName);
        const index = collection.findIndex(item => String(item.id) === String(id));
        if (index === -1) return null;

        collection[index] = { ...collection[index], ...updateData, id };
        db.setCollection(this.collectionName, collection);
        await db.saveData();
        return collection[index];
    }

    async delete(id) {
        const collection = db.getCollection(this.collectionName);
        const initialLength = collection.length;
        const updatedCollection = collection.filter(item => item.id !== id);

        if (updatedCollection.length < initialLength) {
            db.setCollection(this.collectionName, updatedCollection);
            await db.saveData();
            return true;
        }
        return false;
    }
}

export default BaseModel;
