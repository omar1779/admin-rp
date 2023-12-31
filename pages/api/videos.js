import {Videos} from "@/models/Video";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Videos.findOne({_id:req.query.id}));
    } else {
      res.json(await Videos.find());
    }
  }

  if (method === 'POST') {
    const {title,description,duration,videos,teacher} = req.body;
    
    const videosDoc = await Videos.create({
      title,description,duration,videos,teacher
    })
    res.json(videosDoc);
  }

  if (method === 'PUT') {
    const {title,description,duration,videos,teacher,_id} = req.body;
    await Videos.updateOne({_id}, {title,description,duration,videos,teacher});
    res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Videos.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}