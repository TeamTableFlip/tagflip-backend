import {Operator, SearchFilter} from "@fhswf/tagflip-common";

export const SEARCH_QUERY_PARAMETER = "SEARCH_QUERY_PARAMETER"

const {Op} = require("sequelize");
const SearchFilterParam = (target: Object, propertyKey: string, parameterIndex: number) => {
    let existingSearchFilters: number[] =
        Reflect.getOwnMetadata(SEARCH_QUERY_PARAMETER, target, propertyKey) || [];
    existingSearchFilters.push(parameterIndex)
    Reflect.defineMetadata(
        SEARCH_QUERY_PARAMETER,
        existingSearchFilters,
        target,
        propertyKey
    );
}

const ConvertSearchFilter = <T>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
) => {
    let func = target[propertyKey];
    let parameterIndices = Reflect.getMetadata(SEARCH_QUERY_PARAMETER, target, propertyKey)
    let method = descriptor.value;
    descriptor.value = function () {
        for (let index of parameterIndices) {
            if (arguments[index])
                arguments[index] = SearchFilterImpl.ofJson(arguments[index])
        }
        return method.apply(this, arguments);
    }
}

export {SearchFilterParam, ConvertSearchFilter}

export default class SearchFilterImpl implements SearchFilter {

    field!: string;

    filterValue!: any;

    operator!: Operator;

    constructor(filter: SearchFilter) {
        this.field = filter.field;
        this.filterValue = filter.filterValue;
        this.operator = filter.operator;
    }

    public static ofJson(json: string): SearchFilter | SearchFilter[] {
        let object = JSON.parse(json);
        if (Array.isArray(object)) {
            let filters = []
            for (let elem of object) {
                filters.push(new SearchFilterImpl(elem as SearchFilter))
            }
            return filters;
        }
        return new SearchFilterImpl(object)
    }

    public static toSequelize(searchFilter: SearchFilter) {
        switch (searchFilter.operator) {
            case Operator.STARTS_WITH:
                return {[searchFilter.field]: {[Op.startsWith]: searchFilter.filterValue}}
            case Operator.SUBSTRING:
                return {[searchFilter.field]: {[Op.substring]: searchFilter.filterValue}}
            default:
                throw Error("Filter Operation not supported.")
        }
    }
}
