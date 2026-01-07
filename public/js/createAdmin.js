import mongoose from "mongoose";
import dotenv from "dotenv"
import Admin from "../models/admin.model.js"
import { hashPassword } from "../../Src/utils/password.utils.js";

dotenv.config();