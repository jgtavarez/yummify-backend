import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { nextOffset, previousOffset } from '../helpers/paginator';
import Menu from '../models/database/menu'

export const getMenu = async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const { name, description, type } = req.query;

    try {
        const menu = await Menu.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${name || ''}%`
                },
                description: {
                    [Op.iLike]: `%${description || ''}%`
                },
                type: type as string || ['pizza', 'burger', 'extra']
            },
            limit: limit,
            offset: offset,
            order: [
                ['id', 'ASC']
            ]
        })

        res.json({
            "count": menu.count,
            "next": nextOffset(menu.count, limit, offset),
            "previous": previousOffset(menu.count, limit, offset),
            "menu": menu.rows
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error.'
        })
    }
}

export const getFoodById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const food = await Menu.findByPk(id as string)

        res.json(food)
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error.'
        })
    }
}

export const postFood = async (req: Request, res: Response) => {
    const { name, description, price, calories, image, type } = req.body
    const food = Menu.build({ name, description, price, calories, image, type })

    try {
        await food.save()

        res.json({
            msg: 'Food added successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error.'
        })
    }
}

export const deleteFood = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await Menu.destroy({
            where: {
                id
            }
        })

        res.json({
            msg: 'Food deleted successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error.'
        })
    }
}

export const updateFood = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, calories, image, type } = req.body

    try {
        await Menu.update(
            { name, description, price, calories, image, type },
            {
                where: {
                    id
                }
            }
        )

        res.json({
            msg: 'Food updated successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error.'
        })
    }
}
