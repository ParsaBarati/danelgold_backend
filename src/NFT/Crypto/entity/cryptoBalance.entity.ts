import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from 'typeorm';
import {User} from '@/user/user/entity/user.entity';
import {ApiProperty} from '@nestjs/swagger';
import {CryptoEntity} from "@/nft/crypto/entity/crypto.entity";

@Entity('cryptoBalance')
export class CryptoBalanceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    balance: number;


    @ManyToOne(() => CryptoEntity, (crypto) => crypto.balances)
    @ApiProperty({type: () => CryptoEntity})
    crypto: Relation<CryptoEntity>;

    @ManyToOne(() => User, (user) => user.cryptoBalances)
    @ApiProperty({type: () => User})
    user: Relation<User>;

    @Column({type: "timestamp"})
    createdAt: Date
}
