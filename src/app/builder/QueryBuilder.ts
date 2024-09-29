import { FilterQuery, Query } from 'mongoose'

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  search(searchableFields: string[]) {
    const searchTerm = (this.query?.searchTerm as string) ?? ''
    if (this?.query?.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: {
                $regex: searchTerm,
                $options: 'i',
              },
            }) as FilterQuery<T>,
        ),
      })
    }
    return this
  }

  filter(excludeFields: string[]) {
    const queryCopy = structuredClone(this.query)
    excludeFields.forEach((field) => delete queryCopy[field])

    this.modelQuery = this.modelQuery.find(queryCopy as FilterQuery<T>)
    return this
  }

  sort() {
    const sortField: string = (this?.query?.sort as string) || '-createdAt'

    this.modelQuery = this.modelQuery.sort(sortField)

    return this
  }

  paginate() {
    const limit: number = Number(this?.query?.limit as number) || 10
    const page: number = Number(this?.query?.page as number) || 1
    const skip: number = (page - 1) * limit
    this.modelQuery = this.modelQuery.skip(skip).limit(limit)
    return this
  }

  fields() {
    const selectedFields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v'
    this.modelQuery = this.modelQuery.select(selectedFields)
    return this
  }
}
