import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addProductCategoary,
  addProductDetails,
  addProductImages,
  addUserRole,
  createDistributor,
  getAllProducts,
} from "./module";
import { ensureAdmin } from "../utils/authentication";
import { fileMulter } from "../utils/files/distributor_attachments/attachments";
import { product_images_multer } from "../utils/files/product_images/files";
import { join } from "path";
const app = Router();
app.post(
  "/add-user-role",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.body;
      res.status(StatusCodes.CREATED).send(await addUserRole(role));
    } catch (error) {
      next(error);
    }
  }
);
app.post(
  "/register-distributor",
  fileMulter.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      // sharp(req.file?.buffer)
      //   .resize({
      //     width: 800,
      //     fit: sharp.fit.inside,
      //   })
      //   .withMetadata()
      //   .toFile(
      //     join(
      //       __dirname,
      //       "..",
      //       "utils",
      //       "files",
      //       "attachments",
      //       req.file!.originalname.split(".")[0] + ".JPEG"
      //     )
      //   );
      data.attachments = join(
        __dirname,
        "..",
        "utils",
        "files",
        "attachments",
        `${(req as any).fileName}`
      );
      res.status(StatusCodes.CREATED).send(await createDistributor(data));
    } catch (error) {
      next(error);
    }
  }
);
app.use(ensureAdmin);
app.post(
  "/add-product-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_details = req.body;
      res
        .status(StatusCodes.CREATED)
        .send(await addProductDetails(product_details));
    } catch (error) {
      next(error);
    }
  }
);
app.get(
  "/get-all-products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllProducts());
    } catch (error) {
      next(error);
    }
  }
);
app.post(
  "/add-product-images/:productId",
  product_images_multer.array("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;

      res.status(StatusCodes.CREATED).send(
        await addProductImages(
          productId,
          (req.files as any)
            .map((ele: any) => {
              return ele.savedFileNamePath;
            })
            .join(";")
        )
      );
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/add-product-categoary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = req.body;
      res.status(StatusCodes.CREATED).send(await addProductCategoary(details));
    } catch (error) {
      next(error);
    }
  }
);

export default app;
