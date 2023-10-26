import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { TVideos } from "./types";
import { Videos } from "./models/Videos";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const result: TVideos[] = await db("videos");

    const video: Videos[] = result.map(
      (videoDB) =>
        new Videos(
          videoDB.id,
          videoDB.titulo,
          videoDB.duracao,
          videoDB.data_upload
        )
    );

    res.status(200).send(video);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, titulo, duracao } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof titulo !== "string") {
      res.status(400);
      throw new Error("'título' deve ser string");
    }

    if (typeof duracao !== "number") {
      res.status(400);
      throw new Error("'ducaração' deve ser number");
    }

    const [videosDbExists]: TVideos[] | undefined[] = await db("videos").where({
      id,
    });

    if (videosDbExists) {
      res.status(400);
      throw new Error("Id já existe");
    }

    const video = new Videos(id, titulo, duracao, new Date().toISOString());

    const newVideo: TVideos = {
      id: video.getId(),
      titulo: video.getTitulo(),
      duracao: video.getDuracao(),
      data_upload: video.getDataUpload(),
    };

    await db("videos").insert(newVideo);
    const [videoDB]: TVideos[] = await db("videos").where({ id });

    res.status(200).send({ message: "Video cadastrado com sucesso", videoDB });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    const newId = req.body.newId as string;
    const newTitulo = req.body.newTitulo as string;
    const newDuracao = req.body.newDuracao as number;

    const [videoDB] = await db("videos").where({ id: idToEdit });

    if (!videoDB) {
      res.status(400);
      throw new Error("ID não existe");
    }

    const video = new Videos(
      videoDB.id,
      videoDB.titulo,
      videoDB.ducaração,
      videoDB.data_upload
    );

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }
    }

    if (newTitulo !== undefined) {
      if (typeof newTitulo !== "string") {
        res.status(400);
        throw new Error("'título' deve ser string");
      }
    }

    if (newDuracao !== undefined) {
      if (typeof newDuracao !== "number") {
        res.status(400);
        throw new Error("'ducaração' deve ser number");
      }
    }

    newId && video.setId(newId);

    newTitulo && video.setTitulo(newTitulo);

    newDuracao && video.setDuracao(newDuracao);

    const newVideo: TVideos = {
      id: video.getId(),
      titulo: video.getTitulo(),
      duracao: video.getDuracao(),
      data_upload: video.getDataUpload(),
    };

    await db("videos").where({ id: idToEdit }).update(newVideo);

    res
      .status(200)
      .send({ message: "Video editado com sucesso", newVideo: newVideo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Erro inesperado");
  }
});

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    const [videoDB] = await db("videos").where({ id: idToDelete });

    if (!videoDB) {
      res.status(400);
      throw new Error("ID não existe");
    }

    const video = new Videos(
      videoDB.id,
      videoDB.titulo,
      videoDB.ducaração,
      videoDB.data_upload
    );

    await db("videos").delete().where({ id: video.getId() });

    res
      .status(200)
      .send({ message: "Video excluido com sucesso", id: idToDelete });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
