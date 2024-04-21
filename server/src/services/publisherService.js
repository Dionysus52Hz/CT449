import PublisherModel from '~/models/publisherModel';

const createNew = async (reqBody) => {
   try {
      const createdPublisher = await PublisherModel.create(reqBody);
      return createdPublisher;
   } catch (error) {
      throw new Error(error);
   }
};

const getPublishers = async () => {
   try {
      const books = await PublisherModel.find();
      return books;
   } catch (error) {
      throw new Error(error);
   }
};

const getPublisher = async (id) => {
   try {
      const result = await PublisherModel.findById(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const updatePublisher = async (id, data) => {
   try {
      const result = await PublisherModel.findByIdAndUpdate(id, data, {
         returnDocument: 'after',
         runValidators: true,
      });

      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deletePublisher = async (id) => {
   try {
      const result = await PublisherModel.findByIdAndDelete(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

export const PublisherService = {
   createNew,
   getPublishers,
   getPublisher,
   updatePublisher,
   deletePublisher,
};
