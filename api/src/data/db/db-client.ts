import { db } from '../../config/firebase';

export const removeEntity = async (
  entitiesCollectionName: string,
  path: string,
) => {
  try {
    const entityDoc = await db
      .collection(entitiesCollectionName)
      .doc(path)
      .delete();

    return entityDoc.isEqual;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const addEntity = async <T>(
  entitiesCollectionName: string,
  entity: any,
): Promise<T> => {
  try {
    const entityDoc = await db.collection(entitiesCollectionName).add(entity);

    return await getEntityById<T>(entitiesCollectionName, entityDoc.id);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateEntity = async <T>(
  entitiesCollectionName: string,
  id: string,
  data: any,
): Promise<T | null> => {
  try {
    await db.collection(entitiesCollectionName).doc(id).update(data);
    return await getEntityById<T>(entitiesCollectionName, id);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const entityExists = async (
  entitiesCollectionName: string,
  field: string,
  value: string,
): Promise<boolean> => {
  try {
    const doc = await (
      await db.collection(entitiesCollectionName).where(`${field}`, '==', value)
    )
      .limit(1)
      .get();
    return doc.size > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getEntityById = async <T>(
  entitiesCollectionName: string,
  id: string,
): Promise<T | null> => {
  try {
    const doc = await db.collection(entitiesCollectionName).doc(id).get();
    const e = doc.exists ? { id: doc.id, ...doc.data() } : null;
    return e as T;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
export const getEntityByField = async <T>(
  entitiesCollectionName: string,
  field: string,
  value: string,
): Promise<T | null> => {
  try {
    const doc = await (
      await db.collection(entitiesCollectionName).where(`${field}`, '==', value)
    )
      .limit(1)
      .get();
    const e =
      doc.size > 0 ? { id: doc.docs[0].id, ...doc.docs[0].data() } : null;
    return e as T;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
export const listEntitiesByField = async <T>(
  entitiesCollectionName: string,
  field: string,
  value: string,
): Promise<T[]> => {
  try {
    const data = await (
      await db.collection(entitiesCollectionName).where(`${field}`, '==', value)
    ).get();
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<T>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const listEntitiesInField = async <T>(
  entitiesCollectionName: string,
  field: string,
  value: string,
): Promise<T[]> => {
  try {
    const data = await (
      await db
        .collection(entitiesCollectionName)
        .where(`${field}`, 'array-contains', value)
    ).get();
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<T>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const listEntities = async <T>(
  entitiesCollectionName: string,
): Promise<T[]> => {
  try {
    const data = await db.collection(entitiesCollectionName).get();
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<T>;
  } catch (error) {
    console.log(error);
    return [];
  }
};
