import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'
import orphanagesView from '../views/orphanagesView'

export default {
  async index(_: Request, response: Response) {
    const orphanageRepository = getRepository(Orphanage)

    const orphanages = await orphanageRepository.find({
      relations: ['images']
    })

    return response.json(orphanagesView.renderMany(orphanages))
  },

  async show(request: Request, response: Response) {
    const { id } = request.params

    const orphanageRepository = getRepository(Orphanage)

    const orphanage = await orphanageRepository.findOneOrFail(id, {
      relations: ['images']
    })

    return response.json(orphanagesView.render(orphanage))
  },

  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      whatsapp
    } = request.body

    const orphanageRepository = getRepository(Orphanage)

    const requestImages = request.files as Express.Multer.File[]

    const images = requestImages.map(image => {
      return { path: image.filename }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      whatsapp,
      images
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      whatsapp: Yup.string().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required()
      }))
    })

    await schema.validate(data, {
      abortEarly: false
    })

    const orphanage = orphanageRepository.create(data)

    await orphanageRepository.save(orphanage)

    return response.status(201).json(orphanagesView.render(orphanage))
  }
}
