import {Teacher} from "@/models/Teacher";
import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions, isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Teacher.find());
  }

  if (method === 'POST') {
    const {name,descriptionTeacher,properties} = req.body;
    console.log(name,descriptionTeacher)
    const teacherDoc = await Teacher.create({
      name,
      description: descriptionTeacher || undefined,
    });
    res.json(teacherDoc);
  }

  if (method === 'PUT') {
    const {name,descriptionTeacher,_id} = req.body;
    const teacherDoc = await Teacher.updateOne({_id},{
      name,
      description: descriptionTeacher || undefined,
    });
    res.json(teacherDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Teacher.deleteOne({_id});
    res.json('ok');
  }
}