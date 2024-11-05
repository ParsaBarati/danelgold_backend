import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import {CollectionEntity} from "@/market/collection/entity/collection.entity";
import {NFT} from "@/nft/nft/entity/nft.entity";

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(CollectionEntity)
        private collectionRepository: Repository<CollectionEntity>,
        @InjectRepository(NFT)
        private nftRepository: Repository<NFT>,
    ) {}

    async seedCollections(count: number = 10) {
        const collections = [];
        for (let i = 0; i < count; i++) {
            const collection = new CollectionEntity();
            collection.name = faker.company.name();
            collection.creatorIdentifier = 'test@gmail.com';
            collection.cover = faker.image.urlPicsumPhotos();
            collection.text = faker.lorem.text()
            collections.push(collection);
        }
        await this.collectionRepository.save(collections);
        return collections;
    }

    async seedNfts(count: number = 50) {
        const collections = await this.collectionRepository.find();
        const nfts = [];

        for (let i = 0; i < count; i++) {
            const nft = new NFT();
            nft.name = faker.commerce.productName();
            nft.price = parseFloat(faker.commerce.price());
            // Manually select a random collection
            const randomCollection = collections[Math.floor(Math.random() * collections.length)];
            nft.collectionId = randomCollection.id;
            nft.text = faker.lorem.text();
            nft.metadataUrl = faker.internet.url();
            nft.ownerIdentifier = 'test@gmail.com';
            nft.image = faker.image.urlPicsumPhotos();  // Assuming faker.image.urlPicsumPhotos() exists
            nfts.push(nft);
        }

        await this.nftRepository.save(nfts);
        return nfts;
    }
    async seedDatabase() {
        await this.seedCollections(10);
        await this.seedNfts(30);
        console.log('Database seeding completed.');
    }
}
