import "express-async-errors";
import * as express from "express";
import * as cookieParser from 'cookie-parser';
import router from "./router";
import GloblaMiddlewareErrorHandling from "@/lib/middlewares/GloblaMiddlewaresErrorHandling.class";
import ResponseWrapperDTO from "@/types/DTOs/ResponseWrapperDTO.class";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ping', (req: express.Request, res: express.Response) =>  {
    ResponseWrapperDTO.responseWrapper(res, "Hello World!", 200, "string", "Hello World!");
});

app.use(router);
app.use(GloblaMiddlewareErrorHandling.globalErrorMiddleware);
export default app;