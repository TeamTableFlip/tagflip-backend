import "../index";
import {Errors} from "typescript-rest";
import {Model, Repository} from "sequelize-typescript";
import sequelize from "../index";
import {CountOptions, FindOptions, Identifier, InstanceUpdateOptions} from "sequelize";
import {ScopeOptions} from "sequelize/types/lib/model";

export abstract class GenericRepository<T extends Model<T>> {

    protected repository!: Repository<T>;

    constructor(typeClass: new () => T) {
        this.repository = sequelize.getRepository(typeClass);
    }

    public abstract getId(entity: T): Identifier;

    public abstract isNew(id: Identifier): boolean;

    public async abstract validate(entity: T): Promise<void | never>;

    public async read(id: Identifier, scope: string | ScopeOptions = 'defaultScope', options?: FindOptions): Promise<T> {
        if (this.isNew(id)) {
            throw new Errors.NotFoundError("Given ID is missing or invalid.");
        }
        let entity = await this.repository.scope(scope).findByPk(id, options);
        if (!entity) {
            throw new Errors.NotFoundError("No entity for given ID.");
        }
        return entity;
    }

    public async exists(id: Identifier): Promise<boolean> {
        if (this.isNew(id)) {
            return false;
        }

        let entity = await this.repository.findByPk(id);
        return entity !== null;
    }

    public async list(): Promise<T[]> {
        return this.repository.findAll();
    }

    public async getByName(name: string): Promise<T | null> {
        return this.repository.findOne({ where: { name: name } })
    }

    public async count(options?:CountOptions): Promise<number> {
        return this.repository.count(options)
    }

    public async save(entity: T, options?:InstanceUpdateOptions): Promise<T> {
        await this.validate(entity);
        if (this.isNew(this.getId(entity))) {
            return this.repository.build(entity).save(options);
        }

        let foundEntity = await this.read(this.getId(entity));
        return foundEntity.update(entity, options);
    }

    public async delete(id: Identifier): Promise<void> {
        let entity = await this.read(id);
        entity.destroy();
    }

    public getSequelizeRepository(): Repository<T> {
        return this.repository;
    }

}
