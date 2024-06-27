import { Schema, Model, model } from "mongoose";

const WebhookSchema = new Schema(
   {
    webHook: {
            type : String,
            required: true
    }
   }, {
    versionKey: false
   }
);


export default model ('WebHook', WebhookSchema);