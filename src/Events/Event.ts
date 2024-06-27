import { Request, Response } from "express";
import Publication from "../Models/Publication/Publication.models";
import Users from "../Models/User/users.models";
import webHook from "../Models/webHooks/webHook";
import sendNotifyWebhooks from "../Utils/notifyWebhooks";


let Cliente: Response[] =[]

export const event = (req: Request, res: Response) => {
    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('cache-control', 'no-cache');
    res.setHeader('connection', 'keep-alive');
    
    Cliente.push(res);
    
    req.on('close', () => {
        Cliente.splice(Cliente.indexOf(res), 1);
        res.end();
    });
};

export const addPublication = async (req: Request, res: Response) => {
    try {
        const { content, image, userId } = req.body;

        const existedUser = await Users.findById(userId);

        if (!existedUser) return res.status(404).json({ message: "User not found" });

        const newPublication = new Publication({
            content,
            image,
            user: existedUser._id, 
            date: Date.now() 
        });

        await newPublication.save();

        const publicationResponse = {
            content: newPublication.content,
            date: newPublication.date,
            image: newPublication.image,
            user: {
                imgPerfil: existedUser.imgPerfil,
                username: existedUser.username
            },
            _id: newPublication._id
        };

        const webhooksRegister = await webHook.find();
        sendNotifyWebhooks(webhooksRegister, {publication: publicationResponse});

        for (let client of Cliente) {
            client.write(`event: newPublication\n`);
            client.write(`data: ${JSON.stringify(publicationResponse)}\n\n`);
        }

        return res.status(201).json(publicationResponse);

    } catch (error) {
        console.error("Error in the server:", error);

        return res.status(500).json({
            message: "Error in the server"
        });
    }
};


export const addReactions = async (req: Request, res: Response) => {
    try {
        const { userId, idPublication, reaction } = req.body;
        
        const publication = await Publication.findById(idPublication);
        if (!publication) return res.status(404).json({ message: 'Publicación no encontrada' });
        
        const existingReaction = publication.reactions.find(reaction => reaction.user.toString() === userId);
        if (existingReaction) return res.status(400).json({ message: 'El usuario ya ha reaccionado a esta publicación', value: true });
        
        publication.reactions.push({ user: userId, typeReaction: reaction });
        
        await publication.save();
        
        const reactionCount = publication.reactions.length;
        
        const notificationData = { reactionCount, hasReacted: true, id: idPublication };
        
        const webhooksRegister = await webHook.find();
        sendNotifyWebhooks(webhooksRegister, {reaccion: notificationData});

        for (let client of Cliente) {
            client.write(`event: newReaction\n`);
            client.write(`data: ${JSON.stringify(notificationData)}\n\n`);
        }
        
        return res.status(200).json(notificationData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al agregar la reacción" });
    }
};

