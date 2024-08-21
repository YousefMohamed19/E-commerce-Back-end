export class ApiFeature {
    constructor(mongooseQuery, queryData){
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    // pagination

    // page size 
    /**
     * page     size    skip
     * 1         1-5       0
     * 2        6-10       5
     * 3         11-15     10
     */
    pagination(){
        let {page,size}=this.queryData
        page =parseInt(page)
        size =parseInt(size)
        if(page<=0) page=1
        if(size<=0) size=2
        const skip = (page-1)*size
        this.mongooseQuery.limit(size).skip(skip)
        return this
    }
    // sort 
    sort(){
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(','," "))
        return this
    }
    // select
    select(){
        this.mongooseQuery.select(this.queryData.select?.replaceAll(','," "))
        return this
    }
    // filter
    filter(){
        let {page,size,select,sort,...filter}=this.queryData
        filter = JSON.parse(JSON.stringify(filter).replace(/gt|gte|lt|lte/g,match => `$${match}`))
        this.mongooseQuery.find(filter)
        return this
    }
}