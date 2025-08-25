import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const animalApi = createApi({
  reducerPath: "animalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/animal`,
  }),
  tagTypes: ["Animals"],
  endpoints: (builder) => ({
    getAnimals: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getallanimals?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
      providesTags: [{ type: "Animals", id: "LIST" }],
    }),
    getAnimalById: builder.query({
      query: (id) => `getanimal/${id}`,
    }),
    createAnimals: builder.mutation({
      query: (datas) => ({
        url: `createanimals`,
        method: "POST",
        body: datas,
      }),
    }),
    updateAnimal: builder.mutation({
      query: (data) => ({
        url: `updateanimal`,
        method: "POST",
        body: data,
      }),
    }),
    deleteAnimals: builder.mutation({
      query: (ids: string[]) => ({
        url: `deleteanimals`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetAnimalsQuery,
  useGetAnimalByIdQuery,
  useCreateAnimalsMutation,
  useUpdateAnimalMutation,
  useDeleteAnimalsMutation,
} = animalApi;
