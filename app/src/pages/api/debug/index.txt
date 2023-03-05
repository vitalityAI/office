import { authorize } from '@/lib/api/authorize';
import { db } from '@/lib/db/db';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { authorized, user } = await authorize(req, res, false)
    if (!authorized) return res.status(401).send(null)
    const hm = await db.application.findMany({ where: {
      selection: {
        name: "HMMT"
      }
    }, 
    select: {
      author: {
        select: {
          ionUsername: true
        }
      },
      index: true
    }})
    
    const hmp = await db.application.findMany({ where: {
      selection: {
        name: "HMMT Proof"
      }
    }, 
    select: {
      author: {
        select: {
          ionUsername: true
        }
      },
      index: true,
    
    }})

    let o = {}
    for(let s of hm) {
      let k = s.author.ionUsername
      if(o[k] == undefined || o[k] == null) o[k] = {name: k, hm: 0, hmp: 0}
      o[k]["hm"] = s.index
    }
    for(let s of hmp) {
      let k = s.author.ionUsername
      if(o[k] == undefined || o[k] == null) o[k] = {name: k, hm: 0, hmp: 0}
      o[k]["hmp"] = s.index
    }

    // let r = l.map(m => [m.author.ionUsername, m.index])
    o = Object.entries(o).map(m => m[1])
    let s1 = o.map(m => m.name).join('\n')
    let s2 = o.map(m => m.hm).join('\n')
    let s3 = o.map(m => m.hmp).join('\n')

    if (req.method == 'GET') {
      return res.status(200).send([s1, s2, s3].join('\n\n\n'))
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message
    })
  }

  return res.status(400).send(null)
}

export default handler;
