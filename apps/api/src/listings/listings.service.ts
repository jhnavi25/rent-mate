import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ListingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { city?: string; category?: string }) {
    return this.prisma.listing.findMany({
      where: {
        status: ListingStatus.active,
        ...(filters?.city && { city: filters.city }),
        ...(filters?.category && { category: filters.category }),
      },
      include: { media: { orderBy: { sortOrder: 'asc' } }, owner: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { media: true, owner: { select: { id: true, name: true } } },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async create(ownerId: string, dto: CreateListingDto) {
    const listing = await this.prisma.listing.create({
      data: {
        ownerId,
        title: dto.title,
        description: dto.description,
        dailyPricePaise: dto.dailyPricePaise,
        depositPaise: dto.depositPaise,
        category: dto.category,
        city: dto.city,
        status: ListingStatus.active,
        media: dto.mediaUrls?.length
          ? {
              create: dto.mediaUrls.map((url, i) => ({ url, sortOrder: i })),
            }
          : undefined,
      },
      include: { media: true },
    });
    return listing;
  }

  async update(id: string, ownerId: string, dto: UpdateListingDto) {
    const listing = await this.findById(id);
    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('Not your listing');
    }
    return this.prisma.listing.update({
      where: { id },
      data: dto,
      include: { media: true },
    });
  }

  async findByOwner(ownerId: string) {
    return this.prisma.listing.findMany({
      where: { ownerId },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
