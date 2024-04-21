<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { CURRENT_YEAR, PUBLISHERS } from '~/utils/constants';

   const props = defineProps({
      book: Object,
   });

   const emit = defineEmits(['submitBook', 'cancel']);

   const schema = yup.object().shape({
      title: yup.string().required('Tựa đề không thể để trống'),
      description: yup.string(),
      price: yup
         .number()
         .required('Đơn giá không thể để trống')
         .integer('Giá trị phải là số nguyên')
         .nullable(true)
         .typeError('Giá trị phải là số nguyên')
         .moreThan(0, 'Giá phải là giá trị dương'),
      stock: yup
         .number()
         .required('Số quyển không thể để trống')
         .integer('Giá trị phải là số nguyên')
         .nullable(true)
         .typeError('Giá trị phải là số nguyên')
         .min(1, 'Số quyển ít nhất là 1'),
      publisherId: yup.object().required('Cần chọn một nhà xuất bản'),
      publishedYear: yup
         .number()
         .required('Năm xuất bản không thể để trống')
         .integer('Giá trị phải là số nguyên')
         .nullable(true)
         .typeError('Giá trị phải là số nguyên')
         .min(1, `Năm xuất bản phải nằm trong khoảng 1 - ${CURRENT_YEAR}`)
         .max(
            CURRENT_YEAR,
            `Năm xuất bản phải nằm trong khoảng 1 - ${CURRENT_YEAR}`
         ),
      author: yup.string(),
   });

   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
         title: props.book.title,
         description: props.book.description,
         price: props.book.price,
         stock: props.book.stock,
         publisherId: PUBLISHERS.find(
            (publisher) => publisher.id === props.book.publisherId
         ),
         publishedYear: props.book.publishedYear,
         author: props.book.author,
      },
   });

   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });

   const [title, titleProps] = defineField('title', vuetifyConfig);
   const [description, descriptionProps] = defineField(
      'description',
      vuetifyConfig
   );
   const [thumbnail, thumbnailProps] = defineField('thumbnail', vuetifyConfig);
   const [price, priceProps] = defineField('price', vuetifyConfig);
   const [stock, stockProps] = defineField('stock', vuetifyConfig);
   const [author, authorProps] = defineField('author', vuetifyConfig);
   const [publisherId, publisherIdProps] = defineField(
      'publisherId',
      vuetifyConfig
   );
   const [publishedYear, publishedYearProps] = defineField(
      'publishedYear',
      vuetifyConfig
   );

   const onSubmit = handleSubmit((values) => {
      let updateBook;
      values.publisherId = values.publisherId.id;
      const { thumbnail, ...bookData } = props.book;
      updateBook = { ...bookData, ...values };
      emit('submitBook', updateBook);
   });

   defineExpose({ onSubmit });
</script>

<template>
   <v-form
      method="post"
      enctype="multipart/form-data"
      @submit="onSubmit"
      @keyup.enter="onSubmit"
      class="px-4"
   >
      <p class="title">Tựa đề</p>
      <v-text-field
         v-model="title"
         counter
         v-bind="titleProps"
         placeholder="Nhập tựa đề"
         variant="outlined"
         bg-color="surface-light"
      />

      <p class="title">Mô tả</p>
      <v-text-field
         counter
         v-model="description"
         v-bind="descriptionProps"
         placeholder="Nhập mô tả"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />

      <p class="title">Ảnh bìa</p>
      <v-file-input
         accept="image/png, image/jpg, image/jpeg"
         v-model="thumbnail"
         v-bind="thumbnailProps"
         :prepend-icon="null"
         clearable
         variant="outlined"
         bg-color="surface-light"
         type="file"
      >
         <template v-slot:prepend-inner>
            <v-btn
               color="primary"
               variant="tonal"
               >Chọn file</v-btn
            >
         </template>
      </v-file-input>

      <p class="title">Đơn giá</p>
      <v-text-field
         counter
         v-model="price"
         v-bind="priceProps"
         placeholder="Nhập đơn giá"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />

      <p class="title">Số quyển</p>
      <v-text-field
         counter
         v-model="stock"
         v-bind="stockProps"
         placeholder="Nhập số quyển"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />

      <p class="title">Năm xuất bản</p>
      <v-text-field
         counter
         v-model="publishedYear"
         v-bind="publishedYearProps"
         placeholder="Năm xuất bản"
         variant="outlined"
         bg-color="surface-light"
      />

      <p class="title">Nhà xuất bản</p>
      <v-select
         v-model="publisherId"
         v-bind="publisherIdProps"
         :items="PUBLISHERS"
         item-title="name"
         item-value="id"
         placeholder="Nhà xuất bản"
         return-object
         density="default"
         variant="outlined"
         bg-color="surface-light"
      ></v-select>

      <p class="title">Tác giả</p>
      <v-text-field
         counter
         v-model="author"
         v-bind="authorProps"
         placeholder="Tác giả"
         type="text"
         variant="outlined"
         bg-color="surface-light"
      />
   </v-form>
</template>
