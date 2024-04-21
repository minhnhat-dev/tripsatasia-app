"use server"
import prisma from '../prisma';
export const loadTrips = async () => {
    return prisma.trip.findMany({})
}