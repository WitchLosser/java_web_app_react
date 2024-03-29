import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup
import http_common from "../../../../http_common";
import InputGroup from "../../../common/InputGroup";
import SelectGroup from "../../../common/SelectGroup";
import InputFileGroup from "../../../common/InputFileGroup";
import { ICategoryItem } from "../../../../entities/Category";
import { IPorductCreate, IProductItem } from "../../../../entities/Product";
import EditorTiny from "../../../common/EditorTiny";

const ProductCreatePage = () => {
  const navigator = useNavigate();

  const model: IPorductCreate = {
    name: "",
    description: "",
    files: [],
    price: 0,
    category_id: 1,
  };

  const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

  useEffect(() => {
    http_common
      .get("api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((resp) => {
        setCategories(resp.data);
      });
  }, []);

  const createProductSchema = Yup.object().shape({
    name: Yup.string().required("Назва обов'язкова"),
    price: Yup.number().required("Ціна обов'язкова"),
    category_id: Yup.number().required("Категорія обов'язкова"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: model,
    validationSchema: createProductSchema, // Apply validation schema
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price.toString());
        formData.append("category_id", values.category_id.toString());
        formData.append("description", values.description);

        for (let i = 0; i < values.files.length; i++) {
          formData.append("files", values.files[i]);
        }

        const result = await http_common.post<IProductItem>(
          `api/products`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.token}`,
            },
          }
        );

        console.log("Result ", result);
        navigator("/");
      } catch (error: any) {
        console.error("Error: ", error);
      }
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="font-medium text-3xl">Додати товар</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-8 grid lg:grid-cols-1 gap-4">
          <InputGroup
            label={"Назва"}
            value={formik.values.name}
            handleChange={formik.handleChange}
            field={"name"}
            error={formik.errors.name}
            handleBlur={formik.handleBlur}
          />

          <InputGroup
            label={"Ціна"}
            value={formik.values.price.toString()}
            handleChange={formik.handleChange}
            field={"price"}
            type={"number"}
            error={formik.errors.price}
            handleBlur={formik.handleBlur}
          />

          <SelectGroup
            label={"Категорія"}
            field={"category_id"}
            onChange={formik.handleChange}
            items={categories}
          />

          <EditorTiny
            label="Description"
            field="description"
            onEditorChange={(text: string) => {
              formik.setFieldValue("description", text);
            }}
            error={formik.errors.description}
            touched={formik.touched.description}
            value={formik.values.description}
          ></EditorTiny>
          <InputFileGroup
            images={formik.values.files}
            setFieldValue={formik.setFieldValue}
            error={formik.errors.files}
            touched={formik.touched.files}
          ></InputFileGroup>
        </div>
        <div className="space-x-4 mt-8">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
          >
            Додати
          </button>
          <Link
            to="/"
            className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductCreatePage;
