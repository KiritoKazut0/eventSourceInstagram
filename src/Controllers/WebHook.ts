import { Request, Response } from "express";
import webHook from "../Models/webHooks/webHook";

export const registerHook = async (req: Request, res: Response) => {
  try {
    
    
    const { url } = req.body;
    console.log(url);
    if (!url) return res.status(400).json({ message: 'URL is required' });
    
    const existingWebHook = await webHook.findOne({ url: url });
    if (existingWebHook) return res.status(409).json({ message: 'Webhook already registered' });
    
    const newWebHook = new webHook({ webHook: url });
    await newWebHook.save();

    return res.status(201).json({ message: 'Webhook registered', webhook: newWebHook });
  } catch (error) {
    console.error("Error registering webhook:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


